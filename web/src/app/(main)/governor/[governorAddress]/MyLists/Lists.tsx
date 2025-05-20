import { useState } from "react";

import { Button, Card, CustomAccordion, DraggableList } from "@kleros/ui-components-library";
import clsx from "clsx";
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
    <div
      className={clsx(
        "w-full grid grid-cols-1 md:grid-cols-[minmax(300px,_554px)_minmax(300px,_465px)]",
        "place-content-center items-stretch",
        "pt-2 lg:p-6  gap-2.5 md:gap-6"
      )}
    >
      <Card className="size-full pb-4 flex flex-col">
        <DraggableList
          className="border-none flex-1 size-full bg-klerosUIComponentsWhiteBackground max-md:pb-14"
          disallowEmptySelection
          items={transactions.map((txn) => ({ name: txn.name, id: txn.index, value: txn }))}
          selectionCallback={(selected) => setSelectedTxn(selected.value)}
        />
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 px-6 pb-2.5">
          <Button text="Add tx" variant="secondary" small onPress={toggleIsOpen} />
          <Button className="[&_p]:whitespace-break-spaces" text="Submit List with 4.5ETH deposit" small />
        </div>
      </Card>
      <div className="flex flex-col gap-2.5 md:gap-4">
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
    <div className="flex flex-wrap gap-2 md:gap-8 items-center">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">List</h3>
      <span className="text-sm text-klerosUIComponentsSecondaryPurple">{numberOfTxns} Txns</span>
      <small className="flex gap-2 items-center text-xs text-klerosUIComponentsSecondaryText max-md:basis-full">
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
      className={clsx(
        "w-full",
        // button svg
        "[&>div>button]:max-md:p-4 [&_svg]:shrink-0 [&_button_svg]:max-md:self-start",
        // accordion body
        "[&>div>div>div]:p-0"
      )}
      items={lists.map((list) => ({
        title: <AccordionTitle {...list} numberOfTxns={list.transactions.length} />,
        body: <AccordionBody transactions={list.transactions} />,
      }))}
    />
  );
};

export default Lists;
