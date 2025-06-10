"use client";
import { Button, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { Address } from "viem";

import { Submission } from "@/hooks/useFetchSubmittedLists";

import ExamineList from "./ExamineList";
import WithdrawButton from "./WithdrawButton";

interface IExamineModal {
  isOpen?: boolean;
  toggleIsOpen: () => void;
  list: Submission;
  governorAddress: Address;
}

const ExamineModal: React.FC<IExamineModal> = ({ isOpen, toggleIsOpen, list, governorAddress }) => {
  return (
    <Modal
      className={clsx(
        "size-auto max-h-186 overflow-scroll max-w-screen",
        "flex flex-col gap-6 md:gap-8 items-center px-6 pt-4 pb-5 md:p-9"
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsOpen}
      isDismissable
    >
      <h1 className="text-2xl text-klerosUIComponentsPrimaryText font-semibold" slot="title">
        Examine
      </h1>
      <ExamineList {...list} />
      <div className="flex w-full justify-between items-center">
        <Button text="Return" slot="close" variant="secondary" />
        <WithdrawButton {...list} {...{ governorAddress }} />
      </div>
    </Modal>
  );
};

export default ExamineModal;
