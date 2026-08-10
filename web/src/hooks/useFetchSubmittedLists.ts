"use client";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

import { useAccount, usePublicClient } from "wagmi";

import { isUndefined } from "@/utils";

import { DEFAULT_CHAIN } from "@/consts";

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
export const useFetchSubmittedLists = (governorAddress: Address, previousSession = false) => {
  const { data: session } = useFetchSession(governorAddress, previousSession);
  const { chainId } = useAccount();
  // If disconnected, revert to DEFAULT_CHAIN
  const publicClient = usePublicClient({ chainId: chainId ?? DEFAULT_CHAIN.id });

  return useQuery<Submission[] | null>({
    queryKey: [`${governorAddress}-${previousSession ? "previous" : "current"}-lists`],
    refetchInterval: 5000,
    enabled: !isUndefined(session) && !isUndefined(publicClient),
    queryFn: async () => {
      if (isUndefined(publicClient) || isUndefined(session)) return null;

      if (!session.submittedLists || session.submittedLists.length === 0) {
        return [];
      }

      // Batch contract calls using multicall for better performance
      // This reduces network latency from N calls to 1 call
      const submissionCalls = session.submittedLists.map((listId) => ({
        address: governorAddress,
        abi: klerosGovernorAbi,
        functionName: "getSubmission" as const,
        args: [listId] as const,
      }));

      // Execute all getSubmission calls in a single multicall
      const submissionResults = await publicClient.multicall({ contracts: submissionCalls });

      // Process results and fetch additional data for each submission
      const processedResults: (Submission | null)[] = await Promise.all(
        submissionResults.map(async (result, index) => {
          const listId = session.submittedLists[index];

          // Handle potential multicall failures
          if (result.status === "failure") {
            console.error(`Failed to fetch submission for listId ${listId}:`, result.error);
            return null;
          }

          const data = result.result;

          // Fetch logs for description (this remains individual as it's not a simple read)
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

          const updatedTxs: readonly SubmissionTxn[] = data.txs.map((tx, i) => ({
            ...tx,
            description: titles?.[i] ?? "",
          }));

          return { ...data, txs: updatedTxs, listId } as Submission;
        })
      );

      // Filter out any failed results and return as Submission[]
      return processedResults.filter((result): result is Submission => result !== null);
    },
  });
};
