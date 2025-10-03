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
    return {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      timeZone: "GMT",
      timeZoneName: "short",
      ...baseOption,
    };
  }
  if (time) {
    return { hour: "numeric", minute: "numeric", timeZone: "GMT", timeZoneName: "short", ...baseOption };
  }
  if (day) {
    return { weekday: "long", ...baseOption };
  }
  return { month: "long", day: "2-digit", year: "numeric" };
};

export const isUndefined = <T>(maybeObject: T | undefined | null): maybeObject is undefined | null =>
  typeof maybeObject === "undefined" || maybeObject === null;
