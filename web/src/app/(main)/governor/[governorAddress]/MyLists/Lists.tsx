import { Button, Card, CustomAccordion, DraggableList } from "@kleros/ui-components-library";
import { useToggle } from "react-use";

import Calendar from "@/assets/svgs/icons/calendar.svg";

import Status from "../Status";

import AddTxnModal from "./AddTxnModal";

const DisplayCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
  return (
    <Card className="w-full h-auto">
      <div className="w-full bg-klerosUIComponentsLightBackground px-7 pt-2.25 pb-2.75 h-11.25">
        <label id="value-label" className="text-base text-klerosUIComponentsPrimaryText h-6.25">
          {label}
        </label>
      </div>
      <div className="w-full px-7 pt-2.25 pb-2.75 min-h-11.5 h-fit max-h-105 overflow-y-scroll">
        <p
          aria-labelledby="value-label"
          className="break-words whitespace-pre-wrap text-klerosUIComponentsSecondaryText text-sm"
        >
          {value}
        </p>
      </div>
    </Card>
  );
};

const AccordionBody: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  return (
    <div className="w-full p-6 grid gap-6 grid-cols-[auto_465px] items-stretch">
      <Card className="size-full py-4 flex flex-col">
        <DraggableList
          className="border-none flex-1 size-full bg-klerosUIComponentsWhiteBackground"
          items={[
            {
              id: 1,
              name: "Update Governor",
              value: "",
            },
            {
              id: 2,
              name: "Update Metadata",
              value: "",
            },
            {
              id: 3,
              name: "Increase submission cost",
              value: "",
            },
          ]}
        />
        <div className="flex items-center justify-end gap-4 px-6 pb-2.5">
          <Button text="Add tx" variant="secondary" small onPress={toggleIsOpen} />{" "}
          <Button text="Submit List with 4.5ETH deposit" small />
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        <DisplayCard label="Contract Address" value="0x988b3A538b618C7A603e1c11Ab82Cd16dbE28069" />
        <DisplayCard label="Value" value="0" />
        <DisplayCard
          label="Data Input"
          value="TX=(0x988b3A538b618C7A603e1c11Ab82Cd16dbE28069,0x85c855f3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000032d26d12e980b600000)"
        />
        <DisplayCard label="Decoded Input" value="changeSubcourtJurorFee(_subcourtID:3,_feeForJuror:10000000)" />
      </div>
      <AddTxnModal {...{ isOpen, toggleIsOpen }} />
    </div>
  );
};

const AccordionTitle: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-8 items-center">
      <h3 className="text-base text-klerosUIComponentsPrimaryText font-semibold">List</h3>
      <span className="text-sm text-klerosUIComponentsPrimaryPurple">3 Txns</span>
      <small className="flex gap-2 items-center text-xs text-klerosUIComponentsSecondaryText">
        <Calendar className="size-3.5" />
        Tuesday, February 18, 2025
      </small>
      <Status status={0} />
    </div>
  );
};

const Lists: React.FC = () => {
  return (
    <CustomAccordion
      className="w-full"
      items={[
        { title: <AccordionTitle />, body: <AccordionBody /> },
        { title: <AccordionTitle />, body: <AccordionBody /> },
      ]}
    />
  );
};

export default Lists;
