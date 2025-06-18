import { NextRequest, NextResponse } from "next/server";

import { isUndefined } from "@/utils";
import { checkRateLimit, isValidOrigin, SimulateRequestBody, validateRequestBody } from "@/utils/simulateRouteUtils";
import { simulateWithTenderly } from "@/utils/tenderly/simulateWithTenderly";

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // Check rate limit
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

  // Check if request is from our frontend
  if (!isValidOrigin()) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  // Parse and validate request body
  let body: SimulateRequestBody;
  try {
    body = await request.json();

    if (!validateRequestBody(body)) {
      return NextResponse.json({ error: "Invalid request body format" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to parse request body" }, { status: 400 });
  }

  try {
    const { governorAddress, transactions, networkId } = body;

    // Validate transaction count to prevent abuse
    if (transactions.length > 50) {
      return NextResponse.json({ error: "Too many transactions in a single request" }, { status: 400 });
    }

    const simulationResult = await simulateWithTenderly(networkId, governorAddress, transactions);

    if (!isUndefined(simulationResult.simulation.id)) {
      return NextResponse.json({
        status: true,
        simulationLink: `https://www.tdly.co/shared/simulation/${simulationResult.simulation.id}`,
      });
    } else {
      return NextResponse.json(
        {
          status: false,
          simulationLink: undefined,
          error: "Simulation completed but no ID was returned",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Simulation error:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      {
        status: false,
        simulationLink: undefined,
        error: error instanceof Error ? error.message : "Simulation failed",
      },
      { status: 500 }
    );
  }
}
