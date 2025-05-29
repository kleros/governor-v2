import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function formatDate(unixTimestamp: number, withTime = false): string {
  const date = new Date(unixTimestamp * 1000);
  const options: Intl.DateTimeFormatOptions = withTime
    ? {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "GMT",
        timeZoneName: "short",
      }
    : { month: "long", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUndefined = (maybeObject: any): maybeObject is undefined | null =>
  typeof maybeObject === "undefined" || maybeObject === null;
