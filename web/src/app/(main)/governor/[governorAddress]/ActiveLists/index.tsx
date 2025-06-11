"use client";
import { Address } from "viem";

import { useFetchSubmittedLists } from "@/hooks/useFetchSubmittedLists";

import { Skeleton } from "@/components/Skeleton";

import Paper from "@/assets/svgs/icons/paper.svg";

import { isUndefined } from "@/utils";

import ListCard from "./ListCard";

const ActiveLists: React.FC<{ governorAddress: Address }> = ({ governorAddress }) => {
  const { data: lists, isLoading } = useFetchSubmittedLists(governorAddress);
  const { data: lastSessionLists } = useFetchSubmittedLists(governorAddress, true);

  const AlternateElement = isLoading ? (
    <Skeleton className="w-[150px] md:w-[300px] h-[24px]" />
  ) : (
    <span className="text-klerosUIComponentsSecondaryText text-sm mt-4">No lists submitted yet.</span>
  );
  return (
    <div className="w-full flex flex-col gap-4 items-start">
      {isUndefined(lastSessionLists) || lastSessionLists.length === 0 ? null : (
        <>
          <div className="flex gap-2 items-center">
            <Paper className="size-4" />
            <h2 className="text-base text-klerosUIComponentsPrimaryText">Last Session&apos;s List</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-8 w-full">
            {lastSessionLists.map((list) => (
              <ListCard key={list.listHash} {...{ governorAddress, list }} />
            ))}
          </div>
          <hr className="w-full border-klerosUIComponentsStroke max-md:hidden h-0.25" />
        </>
      )}

      {/* Active Lists */}
      <div className="flex gap-2 items-center">
        <Paper className="size-4" />
        <h2 className="text-base text-klerosUIComponentsPrimaryText">Active Lists</h2>
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        {isUndefined(lists) || lists.length === 0
          ? AlternateElement
          : lists.map((list) => <ListCard key={list.listHash} {...{ governorAddress, list }} />)}
      </div>
    </div>
  );
};

export default ActiveLists;
