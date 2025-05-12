import clsx from "clsx";

import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="size-full flex justify-center px-33 pt-20 box-border">
      <div className="max-w-360 w-full items-center flex flex-col gap-12 box-border">
        <div className="flex flex-col gap-4 items-start w-full">
          <Skeleton className="w-[77px] h-[19px]" />
          <div className="w-full">
            <div className={clsx("w-full bg-klerosUIComponentsWhiteBackground min-h-35.5", "p-8 flex flex-col")}>
              <div className="flex justify-between items-center">
                <Skeleton className="w-[123px] h-[38px]" />
                <Skeleton className="w-[163px] h-[24px]" />
              </div>
              <hr className="h-0.25 border-klerosUIComponentsStroke my-4" />
              <Skeleton className="w-[300px] h-[24px]" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 items-start">
          <Skeleton className="w-[123px] h-[24px]" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="w-95.5 min-w-75.5 h-30.5" />
            <Skeleton className="w-95.5 min-w-75.5 h-30.5" />
          </div>
        </div>
        <hr className="w-full border-klerosUIComponentsStroke h-0.25" />
        <div className="w-full flex flex-col gap-4 items-start">
          <Skeleton className="w-[123px] h-[24px]" />
          <div className="w-full flex flex-wrap gap-4">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
