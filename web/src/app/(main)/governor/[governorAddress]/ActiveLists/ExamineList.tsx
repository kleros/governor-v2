import { useMemo, useState } from "react";

import { Card, CustomAccordion, DraggableList } from "@kleros/ui-components-library";
import clsx from "clsx";

import { Submission, SubmissionTxn } from "@/hooks/useFetchSubmittedLists";

import { AddressOrName, IdenticonOrAvatar } from "@/components/ConnectWallet/AccountDisplay";
import DisplayCard from "@/components/ListDisplayCard";
import Status, { ListStatus } from "@/components/Status";

import Calendar from "@/assets/svgs/icons/calendar.svg";

import { formatDate } from "@/utils";

const AccordionBody: React.FC<{ transactions: readonly SubmissionTxn[] }> = ({ transactions }) => {
  const [selectedTxn, setSelectedTxn] = useState<SubmissionTxn>(transactions[0]);

  return (
    <div
      className={clsx(
        "w-full grid grid-cols-1 md:grid-cols-[minmax(300px,_554px)_minmax(300px,_465px)]",
        "place-content-center items-stretch",
        "pt-2 md:p-2 lg:p-6 gap-2.5 md:gap-6"
      )}
    >
      <Card className="size-full py-4 flex flex-col">
        <DraggableList
          dragDisabled
          deletionDisabled
          defaultSelectedKeys={[`${transactions[0].description}-0`]}
          disallowEmptySelection
          className="border-none flex-1 size-full bg-klerosUIComponentsWhiteBackground"
          items={transactions.map((txn, index) => ({
            name: txn.description,
            id: `${txn.description}-${index}`,
            value: txn,
          }))}
          selectionCallback={(selected) => setSelectedTxn(selected.value)}
        />
      </Card>
      <div className="flex flex-col gap-4 md:gap-4">
        <DisplayCard label="Contract Address" value={selectedTxn.target} />
        <DisplayCard label="Value" value={selectedTxn.value.toString()} />
        <DisplayCard label="Data Input" value={selectedTxn.data} />
      </div>
    </div>
  );
};

interface IAccordionTitle extends Submission {
  numberOfTxns: number;
}

const AccordionTitle: React.FC<IAccordionTitle> = ({ submitter, submissionTime, numberOfTxns, approved, txs }) => {
  const status = useMemo(() => {
    if (txs.length > 0 && txs.every((tx) => tx.executed)) return ListStatus.Executed;
    else if (approved) return ListStatus.Approved;
    return ListStatus.Submitted;
  }, [approved, txs]);

  return (
    <div className="flex flex-wrap gap-2 md:gap-8 items-center">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">List</h3>
      <span className="text-sm text-klerosUIComponentsPrimaryPurple">{numberOfTxns} Txns</span>
      <small className="flex gap-2 items-center text-xs text-klerosUIComponentsSecondaryText max-md:basis-full">
        <Calendar className="size-3.5" />
        {formatDate(Number(submissionTime), false, true)}
      </small>
      <Status {...{ status }} />
      <div className="flex gap-2 items-center max-md:basis-full">
        <IdenticonOrAvatar size="16" address={submitter} />
        <AddressOrName className="text-sm text-klerosUIComponentsPrimaryText" address={submitter} />
      </div>
    </div>
  );
};

const ExamineList: React.FC<Submission> = (list) => {
  return (
    <CustomAccordion
      className={clsx(
        "w-full",
        // mobile padding for plus/minus svg
        "[&>div>button]:max-md:p-4 [&_svg]:shrink-0 [&_button_svg]:max-md:self-start",
        // mobile style for accordion body
        "[&>div>div>div]:max-md:p-0"
      )}
      items={[
        {
          title: <AccordionTitle {...list} numberOfTxns={list.txs.length} />,
          body: <AccordionBody transactions={list.txs} />,
        },
      ]}
    />
  );
};

export default ExamineList;
