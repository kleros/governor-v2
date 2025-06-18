"use client";
import { useEffect, useState } from "react";

import { Button, Card, CustomAccordion, DraggableList } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";

import { List, useLists } from "@/context/NewListsContext";

import ExternalLink from "@/components/ExternalLink";
import DisplayCard from "@/components/ListDisplayCard";
import Status from "@/components/Status";

import Calendar from "@/assets/svgs/icons/calendar.svg";
import Trash from "@/assets/svgs/icons/trash.svg";
import TenderlyIcon from "@/assets/svgs/logos/tenderly.svg";

import { formatDate, isUndefined } from "@/utils";
import { formatETH } from "@/utils/format";

import AddTxnModal from "./AddTxnModal";
import SubmissionButton from "./SubmissionButton";
interface IAccordionBody {
  list: List;
}
const AccordionBody: React.FC<IAccordionBody> = ({ list }) => {
  const { id: listId, transactions } = list;
  const [isOpen, toggleIsOpen] = useToggle(false);
  const [simulationShareLink, setSimulationShareLink] = useState<string>();
  const [selectedTxn, setSelectedTxn] = useState<List["transactions"][number] | undefined>(transactions?.[0]);
  const { governorAddress, updateTransactions, deleteList, simulateList, isSimulating } = useLists();

  // select the latest txn, when new txn added
  useEffect(() => {
    if (transactions.length > 0) {
      setSelectedTxn(transactions[transactions.length - 1]);
    } else {
      setSelectedTxn(undefined);
    }
  }, [transactions]);

  const simulate = () => {
    simulateList(listId).then(({ status, simulationLink }) => {
      if (status && !isUndefined(simulationLink)) {
        setSimulationShareLink(simulationLink);
      }
    });
  };
  return (
    <div className="w-full pt-2 lg:px-6 flex flex-col justify-end items-end">
      <Button
        text="Remove"
        small
        variant="secondary"
        icon={<Trash className="[&_path]:fill-klerosUIComponentsPrimaryBlue mr-2" />}
        onPress={() => deleteList(listId)}
      />
      <div
        className={clsx(
          "w-full grid grid-cols-1 md:grid-cols-[minmax(300px,_554px)_minmax(300px,_465px)]",
          "place-content-center items-stretch",
          "pt-2 lg:py-6 gap-2.5 md:gap-6"
        )}
      >
        <Card className="size-full pb-4 flex flex-col">
          <DraggableList
            className="border-none flex-1 size-full bg-klerosUIComponentsWhiteBackground max-md:pb-14"
            disallowEmptySelection
            selectedKeys={selectedTxn ? [selectedTxn.id] : []}
            items={transactions.map((txn) => ({ name: txn.name, id: txn.id, value: txn }))}
            selectionCallback={(selected) => {
              setSelectedTxn(selected.value);
            }}
            updateCallback={(items) =>
              updateTransactions(
                listId,
                items.map((item) => item.value)
              )
            }
            renderEmptyState={() => (
              <small className="w-full block pt-4 text-sm text-klerosUIComponentsSecondaryText text-center">
                Add a transaction to proceed.
              </small>
            )}
          />
          <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 px-6 pb-2.5">
            <Button text="Add tx" variant="secondary" small onPress={toggleIsOpen} />
            <SubmissionButton {...{ governorAddress, list }} />
          </div>
          {transactions.length > 0 ? (
            <div
              className={clsx(
                "w-full px-6 pt-4 gap-4",
                "flex flex-wrap items-center ",
                "border-t border-t-klerosUIComponentsStroke",
                isUndefined(simulationShareLink) ? "justify-end" : "justify-between"
              )}
            >
              {simulationShareLink ? (
                <ExternalLink
                  url={simulationShareLink}
                  text="Inspect on Tenderly"
                  className="text-klerosUIComponentsPrimaryBlue"
                />
              ) : null}
              <Button
                small
                text="Simulate"
                variant="secondary"
                onPress={simulate}
                isDisabled={isSimulating}
                isLoading={isSimulating}
                icon={<TenderlyIcon className="size-4 mr-2 ml" />}
              />
            </div>
          ) : null}
        </Card>
        <div className="flex flex-col gap-2.5 md:gap-4">
          <DisplayCard label="Contract Address" value={selectedTxn?.to ?? ""} />
          <DisplayCard label="Value" value={selectedTxn?.txnValue ? formatETH(BigInt(selectedTxn.txnValue)) : ""} />
          <DisplayCard label="Data Input" value={selectedTxn?.data ?? ""} />
          <DisplayCard label="Decoded Input" value={selectedTxn?.decodedInput ?? ""} />
        </div>

        <AddTxnModal {...{ isOpen, toggleIsOpen, listId }} />
      </div>
    </div>
  );
};

const AccordionTitle: React.FC<List> = ({ createdOn, status, transactions }) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-8 items-center">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">List</h3>
      <span className="text-sm text-klerosUIComponentsSecondaryPurple">{transactions.length} Txns</span>
      <small className="flex gap-2 items-center text-xs text-klerosUIComponentsSecondaryText max-md:basis-full">
        <Calendar className="size-3.5" />
        {formatDate(createdOn, false, true)}
      </small>
      <Status {...{ status }} />
    </div>
  );
};

const Lists: React.FC = () => {
  const { lists } = useLists();

  return lists.length > 0 ? (
    <CustomAccordion
      className={clsx(
        "w-full",
        // button svg
        "[&>div>button]:max-md:p-4 [&_svg]:shrink-0 [&_button_svg]:max-md:self-start",
        // accordion body
        "[&>div>div>div]:p-0"
      )}
      items={lists.map((list) => ({
        title: <AccordionTitle {...list} />,
        body: <AccordionBody {...{ list }} />,
      }))}
    />
  ) : (
    <div className="w-full flex justify-center pt-4">
      <small className="text-sm text-klerosUIComponentsSecondaryText">Create a new list to submit.</small>
    </div>
  );
};

export default Lists;
