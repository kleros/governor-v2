import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";

import { isUndefined } from "@/utils";
import { checkRateLimit } from "@/utils/simulateRouteUtils";

export async function GET(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  const rateLimitCheck = checkRateLimit(ip);
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rateLimitCheck.resetTime || 0 - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const networkId = searchParams.get("networkId");
  const contractAddress = searchParams.get("contractAddress");

  if (!networkId || !contractAddress) {
    return NextResponse.json({ error: "Missing required parameters: networkId and contractAddress" }, { status: 400 });
  }

  if (!isAddress(contractAddress)) {
    return NextResponse.json({ error: "Invalid contract address format" }, { status: 400 });
  }

  try {
    if (isUndefined(process.env.TENDERLY_ACCESS_KEY)) {
      throw new Error("Failed to fetch contract details: Environment variables not configured.");
    }

    // Fetch contract details from Tenderly API
    const tenderlyApiUrl = `https://api.tenderly.co/api/v1/public-contracts/${networkId}/${contractAddress}`;

    const response = await fetch(tenderlyApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": process.env.TENDERLY_ACCESS_KEY,
      },
    });

    if (!response.ok) {
      // If Tenderly fails, try Etherscan as fallback
      return await tryEtherscanFallback(networkId, contractAddress);
    }

    const tenderlyData = await response.json();

    // If contract is unverified in Tenderly, try Etherscan
    if (tenderlyData?.type === "unverified_contract" || isUndefined(tenderlyData?.data?.abi)) {
      return await tryEtherscanFallback(networkId, contractAddress);
    }

    // Return formatted data for verified contract from Tenderly
    return NextResponse.json({
      address: contractAddress,
      name: tenderlyData.contract_name,
      abi: tenderlyData.data.abi,
    });
  } catch (error) {
    console.error("Contract fetch error:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch contract details",
      },
      { status: 500 }
    );
  }
}

async function tryEtherscanFallback(networkId: string, contractAddress: string) {
  try {
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

    if (isUndefined(etherscanApiKey)) {
      return NextResponse.json({ error: "Etherscan API key not configured" }, { status: 500 });
    }

    const baseUrl = "https://api.etherscan.io/v2/api";
    // eslint-disable-next-line max-len
    const url = `${baseUrl}?chainid=${networkId}&module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from Etherscan: ${response.status}` },
        { status: response.status }
      );
    }

    const arbiscanData = await response.json();

    if (arbiscanData.status !== "1" || !arbiscanData.result) {
      return NextResponse.json({ error: "Contract not verified on Etherscan" }, { status: 404 });
    }

    const abi = JSON.parse(arbiscanData.result);

    return NextResponse.json({
      address: contractAddress,
      name: null, // Etherscan doesn't provide contract name in this API
      abi,
    });
  } catch (error) {
    console.error("Etherscan fallback error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch from Etherscan",
      },
      { status: 500 }
    );
  }
}
