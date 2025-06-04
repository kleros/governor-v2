import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function formatDate(unixTimestamp: number, withTime = false, withDay = false): string {
  const date = new Date(unixTimestamp * 1000);

  return date.toLocaleDateString("en-US", getIntlOption(withTime, withDay));
}

const getIntlOption = (time: boolean, day: boolean): Intl.DateTimeFormatOptions => {
  const baseOption: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  if (time && day) {
    return { weekday: "short", minute: "numeric", timeZone: "GMT", timeZoneName: "short", ...baseOption };
  }
  if (time) {
    return { minute: "numeric", timeZone: "GMT", timeZoneName: "short", ...baseOption };
  }
  if (day) {
    return { weekday: "long", ...baseOption };
  }
  return { month: "long", day: "2-digit", year: "numeric" };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUndefined = (maybeObject: any): maybeObject is undefined | null =>
  typeof maybeObject === "undefined" || maybeObject === null;
