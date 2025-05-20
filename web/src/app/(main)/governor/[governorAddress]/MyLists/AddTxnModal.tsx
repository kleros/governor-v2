"use client";
import { useState } from "react";

import { BigNumberField, Button, Form, Modal, Radio, TextArea, TextField } from "@kleros/ui-components-library";
import clsx from "clsx";

import JSONInput from "./JsonInput";

interface IAddTxnModal {
  isOpen?: boolean;
  toggleIsOpen: () => void;
}

const AddTxnModal: React.FC<IAddTxnModal> = ({ isOpen, toggleIsOpen }) => {
  const [inputType, setInputType] = useState(0);
  return (
    <Modal
      className={clsx(
        "max-md:w-full w-150 h-auto max-h-186",
        "overflow-scroll flex flex-col gap-6 items-center px-4 py-6 md:p-8"
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsOpen}
      isDismissable
      modalOverlayClassname={"px-6 max-md:w-full [&_.react-aria-Modal]:max-md:w-full"}
    >
      <h1 className="text-2xl text-klerosUIComponentsPrimaryText font-semibold" slot="title">
        Add tx to List
      </h1>
      <Form
        className="w-full flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          console.log({ data });
        }}
      >
        <TextField
          name="title"
          className="w-full"
          isRequired
          placeholder="eg. Update Non Technical Juror Fee"
          label="Title"
        />
        <TextField
          name="contractAddress"
          className="w-full"
          placeholder="eg. 0x988b3A538b618C7A603e1c11Ab82Cd16dbE28069"
          label="Contract Address"
          isRequired
        />
        <BigNumberField name="value" label="Value" isRequired className="w-full" />
        <Radio
          isRequired
          className="flex gap-6 md:mt-6.5"
          orientation="horizontal"
          small
          aria-label="Input type"
          options={[
            { label: "Data Input", value: "data input" },
            { label: "Contract Input", value: "contract address" },
          ]}
          onChange={(val) => setInputType(val === "data input" ? 0 : 1)}
        />
        {inputType === 0 ? (
          <TextArea isRequired className="w-full h-36 mt-1 md:mt-2 [&_textarea]:size-full" aria-label="Input area" />
        ) : (
          <JSONInput />
        )}
        <Button text="Submit" type="submit" className="self-end mt-2" />
      </Form>
    </Modal>
  );
};

export default AddTxnModal;
