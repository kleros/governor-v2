import { Address } from "viem";

import { isUndefined } from "@/utils";

import { DEFAULT_CHAIN } from "@/consts";

import { useReadGetCurrentSessionNumber, useReadGetSession } from "./useGovernor";

export const useFetchSession = (address: Address) => {
  const { data: currentSessionNumber } = useReadGetCurrentSessionNumber({
    query: {
      refetchInterval: 5000,
    },
    chainId: DEFAULT_CHAIN.id,
    address,
  });

  return useReadGetSession({
    query: {
      refetchInterval: 5000,
      enabled: !isUndefined(currentSessionNumber),
    },
    chainId: DEFAULT_CHAIN.id,
    args: [currentSessionNumber ?? BigInt(0)],
    address,
  });
};
