import { useState } from "react";

import { BigNumberField, Checkbox, DropdownSelect, TextArea, TextField } from "@kleros/ui-components-library";
import clsx from "clsx";
import type { Abi, AbiFunction } from "viem";

import { getDefaultPlaceholder, mapSolidityToInputType } from "@/utils/txnBuilder/format";
import { isJSONParsable, TupleInput } from "@/utils/txnBuilder/parsing";

function renderInputField(input: TupleInput, path: string): JSX.Element {
  const name = input.name || path;

  if (input.type === "tuple" && input.components) {
    return (
      <fieldset
        key={path}
        className={clsx("p-2 border border-klerosUIComponentsStroke rounded mb-2", "flex flex-col gap-4")}
      >
        <legend className="text-klerosUIComponentsPrimaryText text-sm font-semibold">{name} (tuple)</legend>
        {input.components.map((component) => renderInputField(component, `${path}.${component.name}`))}
      </fieldset>
    );
  }

  if (input.type.endsWith("[]")) {
    return (
      <TextField
        key={path}
        className="w-full"
        label={`${name} (${input.type})`}
        name={path}
        isRequired
        placeholder={getDefaultPlaceholder(input.type)}
        validate={(val) => {
          if (isJSONParsable(val)) return true;
          return "Not parsable";
        }}
      />
    );
  }
  const type = mapSolidityToInputType(input.type);
  return (
    <>
      {type === "string" && (
        <TextField
          key={path}
          label={`${name} (${input.type})`}
          isRequired
          name={path}
          placeholder={getDefaultPlaceholder(input.type)}
          className="w-full"
        />
      )}
      {type === "number" && (
        <BigNumberField
          key={path}
          label={`${name} (${input.type})`}
          name={path}
          isRequired
          placeholder={getDefaultPlaceholder(input.type)}
          className="w-full"
        />
      )}
      {type === "boolean" && (
        <Checkbox isRequired small key={path} label={name} name={path} defaultSelected className="w-full" />
      )}
    </>
  );
}

const JSONInput: React.FC = () => {
  const [abiInput, setAbiInput] = useState<string>("");
  const [functions, setFunctions] = useState<AbiFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction | null>(null);

  const [error, setError] = useState<string>("");

  const handleAbiChange = (val: string) => {
    setAbiInput(val);
    setError("");

    try {
      const parsed: Abi = JSON.parse(val);
      if (!Array.isArray(parsed)) throw new Error("ABI must be an array");
      const beautified = JSON.stringify(parsed, null, 2);
      setAbiInput(beautified);

      const functionItems = parsed.filter(
        (item): item is AbiFunction => item.type === "function" && item.stateMutability !== "view"
      );
      setFunctions(functionItems);
      setSelectedFunction(null);
    } catch {
      setError("Invalid ABI JSON");
      setFunctions([]);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="relative w-full">
        <TextArea
          name="contractABI"
          className="w-full h-36 [&_textarea]:size-full"
          aria-label="Input area"
          isRequired
          value={abiInput}
          onChange={handleAbiChange}
          placeholder="Paste contract ABI JSON here"
        />
        <small
          className={clsx(
            "bg-transparent px-2",
            "text-base text-klerosUIComponentsPrimaryText",
            "absolute top-0 left-6 -translate-y-1/2",
            "before:w-full before:h-2/3 before:absolute before:left-0 before:right-0",
            "before:bg-klerosUIComponentsWhiteBackground before:-z-1"
          )}
        >
          ABI
        </small>

        <span className={clsx("text-xs text-klerosUIComponentsPrimaryBlue", "absolute top-1.5 right-2 ")}>{"</>"}</span>
        {error && <p className="text-base text-klerosUIComponentsError mt-2">{error}</p>}
      </div>

      {functions.length > 0 && (
        <DropdownSelect
          isRequired
          name="functionName"
          className={"mt-2 [&_button]:w-fit"}
          items={functions.map((fn, index) => {
            return { text: fn.name, itemValue: fn, id: index };
          })}
          callback={(item) => {
            setSelectedFunction(item.itemValue ?? null);
          }}
        />
      )}

      {selectedFunction && (
        <div className="space-y-4">
          <TextField name="functionName" value={selectedFunction.name} className="hidden" />
          <TextField name="functionABI" value={JSON.stringify(selectedFunction)} className="hidden" />
          <h3 className="text-md  text-klerosUIComponentsPrimaryText font-medium">{selectedFunction.name}</h3>
          {selectedFunction.inputs.map((input) =>
            renderInputField(input, `function.${selectedFunction.name}.${input.name}`)
          )}
        </div>
      )}
    </div>
  );
};

export default JSONInput;
