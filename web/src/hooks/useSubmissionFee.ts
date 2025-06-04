import { Address } from "viem";

import { DEFAULT_CHAIN } from "@/consts";

import { useReadTotalSubmissionDeposit } from "./useGovernor";

export const useSubmissionFee = (address: Address) => {
  return useReadTotalSubmissionDeposit({
    query: {
      refetchInterval: 5000,
    },
    address,
    chainId: DEFAULT_CHAIN.id,
  });
};
