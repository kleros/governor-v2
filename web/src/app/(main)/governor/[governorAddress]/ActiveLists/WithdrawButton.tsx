"use client";
import { useMemo, useState } from "react";

import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";

import { useAccount, usePublicClient } from "wagmi";

import { useFetchSession } from "@/hooks/useFetchSession";
import { Submission } from "@/hooks/useFetchSubmittedLists";
import { useSimulateWithdrawTransactionList, useWriteWithdrawTransactionList } from "@/hooks/useGovernor";

import { EnsureChain } from "@/components/EnsureChain";

import { isUndefined } from "@/utils";
import { wrapWithToast } from "@/utils/wrapWithToast";

interface IWithdrawButton extends Pick<Submission, "listHash" | "listId" | "submitter"> {
  governorAddress: Address;
}

const WithdrawButton: React.FC<IWithdrawButton> = ({ listHash, listId, governorAddress, submitter }) => {
  const [isSending, setIsSending] = useState(false);
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: session } = useFetchSession(governorAddress);

  // submissionID is the index of list in session.submittedLists
  const submissionId = useMemo(() => {
    if (isUndefined(session)) return;
    const index = session.submittedLists.findIndex((_listId) => _listId === listId);

    return index === -1 ? undefined : BigInt(index);
  }, [session, listId]);

  const {
    data: withdrawConfig,
    isLoading: isLoadingConfig,
    isError,
  } = useSimulateWithdrawTransactionList({
    query: {
      enabled: address === submitter || isUndefined(submissionId),
    },
    address: governorAddress,
    args: [submissionId ?? BigInt(0), listHash],
  });

  const { writeContractAsync: withdrawList } = useWriteWithdrawTransactionList();

  const isLoading = isLoadingConfig || isSending;
  const isDisabled = isLoading || isError || isUndefined(withdrawConfig);

  const handleWithdrawList = async () => {
    if (publicClient && withdrawConfig?.request) {
      setIsSending(true);
      wrapWithToast(async () => await withdrawList(withdrawConfig.request), publicClient).finally(() =>
        setIsSending(false)
      );
    }
  };
  return (
    <EnsureChain>
      <Button
        text="Withdraw List"
        className="[&_p]:whitespace-break-spaces"
        {...{ isDisabled, isLoading }}
        small
        onPress={handleWithdrawList}
      />
    </EnsureChain>
  );
};

export default WithdrawButton;
