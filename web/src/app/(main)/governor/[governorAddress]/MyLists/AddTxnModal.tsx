"use client";
import { Modal } from "@kleros/ui-components-library";

interface IAddTxnModal {
  isOpen?: boolean;
  toggleIsOpen: () => void;
}

const AddTxnModal: React.FC<IAddTxnModal> = ({ isOpen, toggleIsOpen }) => {
  return (
    <Modal className="w-150 flex flex-col items-center" isOpen={isOpen} onOpenChange={toggleIsOpen} isDismissable>
      <h1 className="text-2xl text-klerosUIComponentsPrimaryText font-semibold">Add tx to List</h1>
    </Modal>
  );
};

export default AddTxnModal;
