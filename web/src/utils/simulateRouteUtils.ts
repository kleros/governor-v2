import { headers } from "next/headers";
import { Address } from "viem";

import { ListTransaction } from "@/context/NewListsContext";

const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

export type SimulateRequestBody = {
  networkId: number;
  governorAddress: Address;
  transactions: ListTransaction[];
};

// validate the request body
export function validateRequestBody(body: unknown): body is SimulateRequestBody {
  if (!body || typeof body !== "object") return false;

  const typedBody = body as Record<string, unknown>;

  return (
    typeof typedBody.networkId === "number" &&
    typeof typedBody.governorAddress === "string" &&
    Array.isArray(typedBody.transactions) &&
    typedBody.transactions.every((tx: unknown) => {
      if (!tx || typeof tx !== "object") return false;
      const typedTx = tx as Record<string, unknown>;
      return typeof typedTx.to === "string" && typeof typedTx.data === "string" && typeof typedTx.txnValue === "string";
    })
  );
}

// check if the request is from our frontend
export function isValidOrigin(): boolean {
  const headersList = headers();
  const origin = headersList.get("origin");
  const referer = headersList.get("referer");

  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

  if (origin) {
    for (const pattern of allowedOrigins) {
      if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
        if (regex.test(origin)) return true;
      } else if (origin === pattern) {
        return true;
      }
    }
  }

  if (referer) {
    for (const pattern of allowedOrigins) {
      if (pattern.includes("*")) {
        const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}`);
        if (regex.test(referer)) return true;
      } else if (referer.startsWith(pattern)) {
        return true;
      }
    }
  }

  return false;
}

// implement rate limiting
export function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();

  let rateData = ipRequestMap.get(ip);
  if (!rateData) {
    rateData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    ipRequestMap.set(ip, rateData);
  }

  // Reset count if the window has passed
  if (now > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  // Increment count and check if over limit
  rateData.count++;

  if (rateData.count > RATE_LIMIT) {
    return { allowed: false, resetTime: rateData.resetTime };
  }

  return { allowed: true };
}
