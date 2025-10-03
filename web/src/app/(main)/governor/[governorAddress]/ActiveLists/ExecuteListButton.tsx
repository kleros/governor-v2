"use client";
import { useState } from "react";

import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";

import { useAccount, usePublicClient } from "wagmi";

import { Submission } from "@/hooks/useFetchSubmittedLists";
import { useSimulateExecuteTransactionList, useWriteExecuteTransactionList } from "@/hooks/useGovernor";

import { EnsureChain } from "@/components/EnsureChain";

import { isUndefined } from "@/utils";
import { wrapWithToast } from "@/utils/wrapWithToast";

interface IExecuteList extends Pick<Submission, "listId"> {
  governorAddress: Address;
}

const ExecuteListButton: React.FC<IExecuteList> = ({ listId, governorAddress }) => {
  const [isSending, setIsSending] = useState(false);
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const {
    data: executeConfig,
    isLoading: isLoadingConfig,
    isError,
  } = useSimulateExecuteTransactionList({
    query: {
      enabled: isConnected,
    },
    address: governorAddress,
    args: [listId, BigInt(0), BigInt(0)],
  });

  const { writeContractAsync: executeList } = useWriteExecuteTransactionList();

  const isLoading = isLoadingConfig || isSending;
  const isDisabled = isLoading || isError || isUndefined(executeConfig);

  const handleExecuteList = async () => {
    if (publicClient && executeConfig?.request) {
      setIsSending(true);
      wrapWithToast(async () => await executeList(executeConfig.request), publicClient).finally(() =>
        setIsSending(false)
      );
    }
  };
  return (
    <EnsureChain>
      <Button
        text="Execute List"
        className="[&_p]:whitespace-break-spaces"
        {...{ isDisabled, isLoading }}
        small
        onPress={handleExecuteList}
      />
    </EnsureChain>
  );
};

export default ExecuteListButton;
