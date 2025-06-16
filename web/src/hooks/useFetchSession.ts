import { useMemo } from "react";

import { Address } from "viem";

import { isUndefined } from "@/utils";

import { DEFAULT_CHAIN } from "@/consts";

import { useReadGetCurrentSessionNumber, useReadGetSession } from "./useGovernor";

export const useFetchSession = (address: Address, previousSession = false) => {
  const { data: currentSessionNumber } = useReadGetCurrentSessionNumber({
    query: {
      refetchInterval: 5000,
    },
    chainId: DEFAULT_CHAIN.id,
    address,
  });

  const sessionNumber = useMemo(() => {
    if (isUndefined(currentSessionNumber)) return BigInt(0);
    if (previousSession && currentSessionNumber === BigInt(0)) return null;
    return previousSession ? currentSessionNumber - BigInt(1) : currentSessionNumber;
  }, [currentSessionNumber, previousSession]);

  return useReadGetSession({
    query: {
      refetchInterval: 5000,
      enabled: !isUndefined(currentSessionNumber),
    },
    chainId: DEFAULT_CHAIN.id,
    args: [sessionNumber ?? BigInt(0)],
    address,
  });
};
