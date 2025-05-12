import { useState } from "react";

import { Button, Card, CustomAccordion, DraggableList } from "@kleros/ui-components-library";
import { useToggle } from "react-use";

import DisplayCard from "@/components/ListDisplayCard";
import Status from "@/components/Status";

import Calendar from "@/assets/svgs/icons/calendar.svg";

import { List, lists } from "@/consts/mockLists";

import AddTxnModal from "./AddTxnModal";

export const AccordionBody: React.FC<{ transactions: List["transactions"] }> = ({ transactions }) => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const [selectedTxn, setSelectedTxn] = useState<List["transactions"][number]>(transactions[0]);

  return (
    <div className="w-full p-6 grid gap-6 grid-cols-[auto_465px] items-stretch">
      <Card className="size-full py-4 flex flex-col">
        <DraggableList
          className="border-none flex-1 size-full bg-klerosUIComponentsWhiteBackground"
          disallowEmptySelection
          items={transactions.map((txn) => ({ name: txn.name, id: txn.index, value: txn }))}
          selectionCallback={(selected) => setSelectedTxn(selected.value)}
        />
        <div className="flex items-center justify-end gap-4 px-6 pb-2.5">
          <Button text="Add tx" variant="secondary" small onPress={toggleIsOpen} />
          <Button text="Submit List with 4.5ETH deposit" small />
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        <DisplayCard label="Contract Address" value={selectedTxn.to} />
        <DisplayCard label="Value" value={selectedTxn.value.toString()} />
        <DisplayCard label="Data Input" value={selectedTxn.data} />
        <DisplayCard label="Decoded Input" value={selectedTxn.decodedInput} />
      </div>

      <AddTxnModal {...{ isOpen, toggleIsOpen }} />
    </div>
  );
};

interface IAccordionTitle extends Pick<List, "createdOn" | "status"> {
  numberOfTxns: number;
}

export const AccordionTitle: React.FC<IAccordionTitle> = ({ createdOn, status, numberOfTxns }) => {
  return (
    <div className="flex flex-wrap gap-8 items-center">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">List</h3>
      <span className="text-sm text-klerosUIComponentsPrimaryPurple">{numberOfTxns} Txns</span>
      <small className="flex gap-2 items-center text-xs text-klerosUIComponentsSecondaryText">
        <Calendar className="size-3.5" />
        {createdOn}
      </small>
      <Status {...{ status }} />
    </div>
  );
};

const Lists: React.FC = () => {
  return (
    <CustomAccordion
      className="w-full"
      items={lists.map((list) => ({
        title: <AccordionTitle {...list} numberOfTxns={list.transactions.length} />,
        body: <AccordionBody transactions={list.transactions} />,
      }))}
    />
  );
};

export default Lists;
