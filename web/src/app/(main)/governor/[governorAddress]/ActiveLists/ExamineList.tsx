import { useState } from "react";

import { Card, CustomAccordion, DraggableList } from "@kleros/ui-components-library";

import { AddressOrName, IdenticonOrAvatar } from "@/components/ConnectWallet/AccountDisplay";
import DisplayCard from "@/components/ListDisplayCard";

import Calendar from "@/assets/svgs/icons/calendar.svg";

import { List } from "@/consts/mockLists";

import Status from "../../../../../components/Status";

export const AccordionBody: React.FC<{ transactions: List["transactions"] }> = ({ transactions }) => {
  const [selectedTxn, setSelectedTxn] = useState<List["transactions"][number]>(transactions[0]);

  return (
    <div className="w-full p-6 grid gap-6 grid-cols-[auto_465px] items-stretch">
      <Card className="size-full py-4 flex flex-col">
        <DraggableList
          dragDisabled
          deletionDisabled
          defaultSelectedKeys={[0]}
          disallowEmptySelection
          className="border-none flex-1 min-w-138.5 size-full bg-klerosUIComponentsWhiteBackground"
          items={transactions.map((txn) => ({ name: txn.name, id: txn.index, value: txn }))}
          selectionCallback={(selected) => setSelectedTxn(selected.value)}
        />
      </Card>
      <div className="flex flex-col gap-4">
        <DisplayCard label="Contract Address" value={selectedTxn.to} />
        <DisplayCard label="Value" value={selectedTxn.value.toString()} />
        <DisplayCard label="Data Input" value={selectedTxn.data} />
        <DisplayCard label="Decoded Input" value={selectedTxn.decodedInput} />
      </div>
    </div>
  );
};

interface IAccordionTitle extends Pick<List, "submitter" | "createdOn" | "status"> {
  numberOfTxns: number;
}

export const AccordionTitle: React.FC<IAccordionTitle> = ({ submitter, createdOn, numberOfTxns, status }) => {
  return (
    <div className="flex flex-wrap gap-8 items-center">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">List</h3>
      <span className="text-sm text-klerosUIComponentsPrimaryPurple">{numberOfTxns} Txns</span>
      <small className="flex gap-2 items-center text-xs text-klerosUIComponentsSecondaryText">
        <Calendar className="size-3.5" />
        {createdOn}
      </small>
      <Status {...{ status }} />
      <div className="flex gap-2 items-center">
        <IdenticonOrAvatar size="16" address={submitter} />
        <AddressOrName className="text-sm text-klerosUIComponentsPrimaryText" address={submitter} />
      </div>
    </div>
  );
};

const ExamineList: React.FC<List> = (list) => {
  return (
    <CustomAccordion
      className="w-max"
      items={[
        {
          title: <AccordionTitle {...list} numberOfTxns={list.transactions.length} />,
          body: <AccordionBody transactions={list.transactions} />,
        },
      ]}
    />
  );
};

export default ExamineList;
