"use client";
import { useMemo, useState } from "react";

import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";

import { usePublicClient } from "wagmi";

import { List, useLists } from "@/context/NewListsContext";
import { useSimulateSubmitList, useWriteSubmitList } from "@/hooks/useGovernor";
import { useSubmissionFee } from "@/hooks/useSubmissionFee";

import { EnsureChain } from "@/components/EnsureChain";
import { ListStatus } from "@/components/Status";

import { isUndefined } from "@/utils";
import { formatETH } from "@/utils/format";
import { constructSubmissionData } from "@/utils/txnBuilder/constructSubmissionData";
import { wrapWithToast } from "@/utils/wrapWithToast";

interface ISubmissionButton {
  governorAddress: Address;
  list: List;
}

const SubmissionButton: React.FC<ISubmissionButton> = ({ governorAddress, list }) => {
  const [isSending, setIsSending] = useState(false);
  const publicClient = usePublicClient();
  const { updateList } = useLists();
  const { data: submissionFee, isLoading: isLoadingFee } = useSubmissionFee(governorAddress);
  const { id: listId, transactions } = list;

  const functionArgs = useMemo(() => constructSubmissionData(transactions), [transactions]);

  const {
    data: submissionConfig,
    isLoading: isLoadingConfig,
    isError,
  } = useSimulateSubmitList({
    query: {
      enabled: transactions.length > 0 && !isUndefined(submissionFee),
    },
    address: governorAddress,
    args: [functionArgs.addresses, functionArgs.values, functionArgs.data, functionArgs.dataSizes, functionArgs.titles],
    value: submissionFee,
  });

  const { writeContractAsync: submitList } = useWriteSubmitList();

  const isLoading = isLoadingFee || isLoadingConfig || isSending;
  const isDisabled = isLoading || isError || transactions.length === 0 || list.status === ListStatus.Submitted;

  const handleSubmitList = async () => {
    if (publicClient && submissionConfig?.request) {
      setIsSending(true);
      wrapWithToast(async () => await submitList(submissionConfig.request), publicClient)
        .then(({ status }) => {
          if (status) {
            updateList(listId, { status: ListStatus.Submitted });
          }
        })
        .finally(() => setIsSending(false));
    }
  };
  return (
    <EnsureChain>
      <Button
        className="[&_p]:whitespace-break-spaces"
        {...{ isDisabled, isLoading }}
        text={!isUndefined(submissionFee) ? `Submit List with ${formatETH(submissionFee)} ETH deposit` : "Submit List"}
        small
        onPress={handleSubmitList}
      />
    </EnsureChain>
  );
};

export default SubmissionButton;
