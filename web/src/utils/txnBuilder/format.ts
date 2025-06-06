import { TupleInput } from "./parsing";

export const getDefaultPlaceholder = (inputType: TupleInput): string => {
  const type = inputType.type;
  if ((type.startsWith("uint") || type.startsWith("int")) && !type.endsWith("[]")) return "Example: 123";
  if (type === "address") return "Example: 0xabc...123";
  if (type === "bool") return "Example: true";
  if (type === "bytes32") return "Example: 0x123abc...";
  if (type === "string") return 'Example: "hello"';

  if (type === "tuple[]") {
    const components = inputType.components!;
    return `Example: [[${components.map((component) => {
      const baseExample = getDefaultPlaceholder(component).replace("Example: ", "");
      return baseExample;
    })}]]`;
  }

  if (type !== "tuple[]" && type.endsWith("[]")) {
    const baseType = type.slice(0, -2);
    const baseExample = getDefaultPlaceholder({ type: baseType }).replace("Example: ", "");
    return `Example: [${baseExample}, ${baseExample}]`;
  }

  return "Example: value";
};

export const mapSolidityToInputType = (type: string): string => {
  if (type.startsWith("uint") || type.startsWith("int")) return "number";
  if (type === "address" || type === "string" || type.includes("bytes")) return "string";
  if (type === "bool") return "boolean";
  return "string";
};

export const flattenToNested = (formData: Record<string, string>, fnName: string) => {
  const prefix = `function.${fnName}.`;
  const nested = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (!key.startsWith(prefix)) return;

    const path = key.slice(prefix.length).split(".");
    let current = nested;

    for (let i = 0; i < path.length; i++) {
      const part = path[i];

      // Final part — set the value
      if (i === path.length - 1) {
        if (value === "on" || value === "off") {
          current[part] = value === "on";
        } else {
          current[part] = value;
        }
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  });

  return nested;
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const formatFunctionCall = (fnName: string, inputs: any, indentLevel = 2): string => {
  const indent = (level: number) => " ".repeat(level);

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const formatValue = (val: any, level: number): string => {
    if (Array.isArray(val)) {
      if (val.length === 0) return `[]`;
      return `[\n${val.map((v) => indent(level + 2) + formatValue(v, level + 2)).join(",\n")}\n${indent(level)}]`;
    } else if (typeof val === "object" && val !== null) {
      const entries = Object.entries(val);
      if (entries.length === 0) return `{}`;
      return `{\n${entries
        .map(([k, v]) => `${indent(level + 2)}${k}: ${formatValue(v, level + 2)}`)
        .join(",\n")}\n${indent(level)}}`;
    } else if (typeof val === "string") {
      return `"${val}"`;
    } else {
      return String(val);
    }
  };

  const args = Object.entries(inputs)
    .map(([key, val]) => `${indent(indentLevel)}${key}: ${formatValue(val, indentLevel)}`)
    .join(",\n");

  const initialNewLine = Object.entries(inputs).length !== 0;
  return `function ${fnName}(${initialNewLine ? "\n" : ""}${args}${initialNewLine ? "\n" : ""})`;
};
