import { Address } from "viem";

import { DEFAULT_CHAIN } from "@/consts";

import { useFetchSession } from "./useFetchSession";
import { useReadSubmissionTimeout } from "./useGovernor";
import { useSessionStart } from "./useSessionStart";

export const useSessionEnd = (address: Address) => {
  const { data: sessionStart } = useSessionStart(address);
  const { data: session } = useFetchSession(address);

  const { data: submissionTimeout } = useReadSubmissionTimeout({
    query: {
      refetchInterval: 5000,
    },
    chainId: DEFAULT_CHAIN.id,
    address,
  });
  return sessionStart && session && submissionTimeout
    ? sessionStart + session.durationOffset + submissionTimeout
    : undefined;
};
