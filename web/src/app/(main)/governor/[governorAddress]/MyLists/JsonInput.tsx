import { useState } from "react";

import { BigNumberField, Checkbox, DropdownSelect, TextArea, TextField } from "@kleros/ui-components-library";
import clsx from "clsx";
import type { Abi, AbiFunction } from "viem";

type FormValues = Record<string, string | number | string[]>;

type TupleInput = AbiFunction["inputs"][number] & { components?: AbiFunction["inputs"] };

const mapSolidityToInputType = (type: string): string => {
  if (type.startsWith("uint") || type.startsWith("int")) return "number";
  if (type === "address" || type === "string" || type.includes("bytes")) return "string";
  if (type === "bool") return "boolean";
  return "string";
};

function renderInputField(
  input: TupleInput,
  path: string,
  onChange: (name: string, value: string | number | string[]) => void
): JSX.Element {
  const name = input.name || path;

  if (input.type === "tuple" && input.components) {
    return (
      <fieldset
        key={path}
        className={clsx("p-2 border border-klerosUIComponentsStroke rounded mb-2", "flex flex-col gap-4")}
      >
        <legend className="text-klerosUIComponentsPrimaryText text-sm font-semibold">{name} (tuple)</legend>
        {input.components.map((component) => renderInputField(component, `${path}.${component.name}`, onChange))}
      </fieldset>
    );
  }

  if (input.type.endsWith("[]")) {
    return (
      <TextField
        key={path}
        className="w-full"
        label={name}
        isRequired
        placeholder={`${name} (array of ${input.type.slice(0, -2)})}`}
        onChange={(val) => onChange(path, val.split(","))}
      />
    );
  }
  const type = mapSolidityToInputType(input.type);
  return (
    <>
      {type === "string" && (
        <TextField
          key={path}
          label={name}
          isRequired
          placeholder={input.type}
          className="w-full"
          onChange={(val) => onChange(path, val)}
        />
      )}
      {type === "number" && (
        <BigNumberField
          key={path}
          label={name}
          isRequired
          placeholder={input.type}
          className="w-full"
          onChange={(val) => onChange(path, val.toString())}
        />
      )}
      {type === "boolean" && (
        <Checkbox
          isRequired
          small
          key={path}
          label={name}
          className="w-full"
          onChange={(val) => onChange(path, val.toString())}
        />
      )}
    </>
  );
}

const JSONInput: React.FC = () => {
  const [abiInput, setAbiInput] = useState<string>("");
  const [functions, setFunctions] = useState<AbiFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<FormValues>({});
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="relative w-full">
        <TextArea
          name="contract input"
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
          className={"mt-2 [&_button]:w-fit"}
          items={functions.map((fn, index) => {
            return { text: fn.name, itemValue: fn, id: index };
          })}
          callback={(item) => {
            setSelectedFunction(item.itemValue ?? null);
            setFormValues({});
          }}
        />
      )}

      {selectedFunction && (
        <div className="space-y-4">
          <h3 className="text-md  text-klerosUIComponentsPrimaryText font-medium">{selectedFunction.name}</h3>
          {selectedFunction.inputs.map((input, index) =>
            renderInputField(input, input.name || `arg${index}`, handleFieldChange)
          )}
        </div>
      )}
    </div>
  );
};

export default JSONInput;
