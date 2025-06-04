"use client";
import { useState } from "react";

import { BigNumberField, Button, Form, Modal, Radio, TextArea, TextField } from "@kleros/ui-components-library";
import clsx from "clsx";
import { type Abi, type AbiFunction, Address, encodeFunctionData, isAddress } from "viem";

import { ListTransaction, useLists } from "@/context/LIstsContext";

import { isUndefined } from "@/utils";
import { flattenToNested, formatFunctionCall } from "@/utils/txnBuilder/format";
import { buildArgs } from "@/utils/txnBuilder/parsing";

import JSONInput from "./JsonInput";

enum InputType {
  DataInput,
  ContractInput,
}
interface IAddTxnModal {
  listId: number;
  isOpen?: boolean;
  toggleIsOpen: () => void;
}

const AddTxnModal: React.FC<IAddTxnModal> = ({ listId, isOpen, toggleIsOpen }) => {
  const [inputType, setInputType] = useState(0);
  const { addTxnToList } = useLists();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const contractAddress: string = data["contractAddress"].toString();
      const value: string = data["value"].toString();
      const description: string = data["title"].toString();
      const inputMethod: string = data["inputMethod"].toString();

      let txnData: string = "";
      let decodedInput: string | undefined = undefined;

      if (inputMethod === InputType.DataInput.toString()) {
        txnData = data["dataInput"].toString();
      } else {
        const functionAbi: AbiFunction = JSON.parse(data["functionABI"].toString());
        const contractAbi: Abi = JSON.parse(data["contractABI"].toString());
        const functionName: string = data["functionName"].toString();
        if (!isUndefined(functionAbi)) {
          const parsedArgs = buildArgs(
            functionAbi.inputs,
            `function.${data["functionName"]}`,
            data as Record<string, string>
          );

          txnData = encodeFunctionData({
            abi: contractAbi,
            functionName,
            args: parsedArgs,
          });

          const nestedInputs = flattenToNested(data as Record<string, string>, functionName);
          decodedInput = formatFunctionCall(functionName, nestedInputs);
        }
      }
      const transaction: Omit<ListTransaction, "id"> = {
        to: contractAddress as Address,
        value,
        name: description,
        data: txnData,
        decodedInput,
      };

      addTxnToList(listId, transaction);

      toggleIsOpen();
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <Modal
      className={clsx(
        "w-full md:w-150 h-auto max-h-186",
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
      <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
          validate={(value) => {
            if (!isAddress(value)) return "Should be an address.";
            else return true;
          }}
          label="Contract Address"
          isRequired
        />
        <BigNumberField name="value" label="Value" defaultValue={"0"} isRequired className="w-full" />
        <Radio
          isRequired
          className="flex gap-6 md:mt-6.5"
          orientation="horizontal"
          small
          name="inputMethod"
          defaultValue={InputType.DataInput.toString()}
          aria-label="Input type"
          options={[
            { label: "Data Input", value: InputType.DataInput.toString() },
            { label: "Contract Input", value: InputType.ContractInput.toString() },
          ]}
          onChange={(val) =>
            setInputType(val === InputType.DataInput.toString() ? InputType.DataInput : InputType.ContractInput)
          }
        />
        {inputType === InputType.DataInput ? (
          <TextArea
            isRequired
            name="dataInput"
            className="w-full h-36 mt-1 md:mt-2 [&_textarea]:size-full"
            aria-label="Input area"
          />
        ) : (
          <JSONInput />
        )}
        <Button text="Submit" type="submit" className="self-end mt-2" />
      </Form>
    </Modal>
  );
};

export default AddTxnModal;
