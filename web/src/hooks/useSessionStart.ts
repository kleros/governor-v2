import { Address } from "viem";

import { DEFAULT_CHAIN } from "@/consts";

import { useReadLastApprovalTime } from "./useGovernor";

export const useSessionStart = (address: Address) => {
  return useReadLastApprovalTime({
    query: {
      refetchInterval: 5000,
    },
    address,
    chainId: DEFAULT_CHAIN.id,
  });
};
