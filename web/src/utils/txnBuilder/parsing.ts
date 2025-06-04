import { AbiFunction } from "viem";

import { isUndefined } from "..";
import { uncommify } from "../commify";

export type TupleInput = AbiFunction["inputs"][number] & { components?: readonly TupleInput[] };

export const isJSONParsable = (data: string) => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

export function buildArgs(inputs: readonly TupleInput[], prefix: string, formValues: Record<string, string>) {
  return inputs.map((input) => {
    const fullPath = `${prefix}.${input.name}`;

    if (input.type === "tuple" && input.components) {
      return buildArgs(input.components, fullPath, formValues);
    }

    if (input.type.endsWith("[]")) {
      const raw = formValues?.[fullPath];
      if (isUndefined(raw)) return [];

      // handles tuple[]
      if (input.type.startsWith("tuple")) {
        try {
          const parsed = JSON.parse(raw);

          if (Array.isArray(parsed) && input.components) {
            return convertArrayValue(parsed, input);
          }
        } catch {
          return [];
        }
      }
      // handle types like uint[], string[]
      else {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.map((val) => convertValue(val, input.type.replace("[]", "")));
          }
        } catch {
          return [];
        }
      }
    }

    const value = formValues?.[fullPath];
    if (input.type === "bool") return value === "on" || value === "true";
    if (input.type.startsWith("uint") || input.type.startsWith("int")) return BigInt(uncommify(value) ?? 0);
    return value;
  });
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
const convertValue = (value: any, type: string) => {
  if (type.startsWith("uint") || type.startsWith("int")) return BigInt(uncommify(value));
  if (type === "bool") return value === "true";
  return String(value);
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
const convertArrayValue = (values: any[], inputType: TupleInput) => {
  return values.map((val) => {
    return inputType.components?.map((type, index) => {
      // if it's a nested array, recurse with values[index] and type.components
      if (type.components && Array.isArray(val[index])) return convertArrayValue(val[index], type);
      return convertValue(val[index], type.type);
    });
  });
};
