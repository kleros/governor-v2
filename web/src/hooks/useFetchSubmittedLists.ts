"use client";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

import { usePublicClient } from "wagmi";

import { isUndefined } from "@/utils";

import { klerosGovernorAbi } from "./contracts/generated";

import { useFetchSession } from "./useFetchSession";

export type SubmissionTxn = {
  target: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  executed: boolean;
  description: string;
};

export type Submission = {
  listId: bigint;
  submitter: `0x${string}`;
  deposit: bigint;
  txs: readonly SubmissionTxn[];
  listHash: `0x${string}`;
  submissionTime: bigint;
  approved: boolean;
  approvalTime: bigint;
  submissionBlock: bigint;
};

/** Fetches the submitted lists with transactions, each txn having the description */
export const useFetchSubmittedLists = (governorAddress: Address) => {
  const { data: session } = useFetchSession(governorAddress);
  const publicClient = usePublicClient();

  return useQuery<Submission[] | null>({
    queryKey: [`${governorAddress}-lists`],
    refetchInterval: 5000,
    enabled: !isUndefined(session) && !isUndefined(publicClient),
    queryFn: async () => {
      if (isUndefined(publicClient) || isUndefined(session)) return null;

      const listsPromises = session.submittedLists.map(async (listId) => {
        const data = await publicClient.readContract({
          address: governorAddress,
          abi: klerosGovernorAbi,
          functionName: "getSubmission",
          args: [listId],
        });

        const logs = await publicClient.getContractEvents({
          address: governorAddress,
          abi: klerosGovernorAbi,
          eventName: "ListSubmitted",
          toBlock: data.submissionBlock,
          fromBlock: data.submissionBlock,
          args: {
            // This ensures we don't pick up the wrong event, in case multiple lists were submitted in same block;
            _listID: listId,
          },
          strict: true,
        });

        // should only be one
        const log = logs?.[0];
        let titles: string[] = [];

        if (!isUndefined(log)) {
          titles = log.args._description.split(",");
        }

        const updatedTxs: SubmissionTxn[] = data.txs.map((tx, i) => ({
          ...tx,
          description: titles?.[i] ?? "",
        }));

        return { ...data, txs: updatedTxs, listId };
      });
      return await Promise.all(listsPromises);
    },
  });
};
