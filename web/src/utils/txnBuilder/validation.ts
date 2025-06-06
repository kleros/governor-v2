import { isAddress, isHex } from "viem";
import { forceNumbersToStringsInJson, TupleInput } from "./parsing";

export const validateInputValue = (value: string | BigInt | BigNumber | null, inputType: TupleInput): true | string => {
  if (!value) return true;

  const val = value.toString().trim();

  if (inputType.type === "tuple[]") {
    try {
      JSON.parse(val);
      const parsed = JSON.parse(forceNumbersToStringsInJson(val));

      for (let i = 0; i < parsed.length; i++) {
        if (!Array.isArray(parsed[i])) return `Value at index ${i} must be an Array`;
        const tuple = parsed[i];

        if (tuple.length !== inputType.components?.length) return `Too few parameters in Array at index ${i}`;

        for (let j = 0; j < tuple.length; j++) {
          // components is bound to be defined inside tuple[]
          const baseType = inputType.components?.at(j) as TupleInput;

          const res = validateInputValue(tuple[j], baseType);
          if (res !== true) return `Invalid element at index ${j} in Array ${i}: ${res}`;
        }
      }
      return true;
    } catch {
      return "Value must be a valid JSON object or array of objects";
    }
  }

  // handling homogenous arrays
  if (inputType.type.endsWith("[]")) {
    try {
      JSON.parse(val);
      const parsed = JSON.parse(forceNumbersToStringsInJson(val));

      if (!Array.isArray(parsed)) return "Value must be a JSON array";

      const baseType = inputType.type.slice(0, -2);

      for (let i = 0; i < parsed.length; i++) {
        const res = validateInputValue(parsed[i], { type: baseType });
        if (res !== true) return `Invalid element at index ${i}: ${res}`;
      }
      return true;
    } catch {
      return "Value must be a valid JSON array";
    }
  }

  // Address
  if (inputType.type === "address") {
    return isAddress(val) ? true : "Invalid address format";
  }

  // String / Bytes
  if (inputType.type === "string") return true;
  if (inputType.type.startsWith("bytes")) {
    return isHex(val) ? true : "Invalid bytes format";
  }

  // Unsigned Integer
  if (inputType.type.startsWith("uint")) {
    const bits = parseInt(inputType.type.slice(4)) || 256;
    const max = BigInt(2) ** BigInt(bits) - BigInt(1);
    try {
      const bigVal = BigInt(val);
      if (bigVal < BigInt(0)) return "Unsigned integers must be non-negative";
      if (bigVal > max) return `Value exceeds uint${bits} max of ${max}`;

      return true;
    } catch {
      return "Must be a valid unsigned integer";
    }
  }

  // int
  if (inputType.type.startsWith("int")) {
    const bits = parseInt(inputType.type.slice(3)) || 256;
    const min = -(BigInt(2) ** BigInt(bits - 1));
    const max = BigInt(2) ** BigInt(bits - 1) - BigInt(1);
    try {
      const bigVal = BigInt(val);
      if (bigVal < min || bigVal > max) return `Value must be between ${min} and ${max}`;

      return true;
    } catch {
      return "Must be a valid signed integer";
    }
  }

  return true;
};
