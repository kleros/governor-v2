"use client";

import { useRef } from "react";

import clsx from "clsx";
import { useHoverDirty, useToggle } from "react-use";

import { AddressOrName, IdenticonOrAvatar } from "@/components/ConnectWallet/AccountDisplay";
import Status from "@/components/Status";

import Calendar from "@/assets/svgs/icons/calendar.svg";
import Search from "@/assets/svgs/icons/search.svg";

import { List } from "@/consts/mockLists";

import ExamineModal from "./ExamineModal";

const ListCard: React.FC<List> = (list) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHovered = useHoverDirty(cardRef);
  const [isOpen, toggleIsOpen] = useToggle(false);
  return (
    <div
      ref={cardRef}
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground ",
        "max-md:w-full w-95.5 max-md:h-fit h-30.5",
        "cursor-pointer relative rounded-base box-border",
        "border border-klerosUIComponentsStroke hover-short-transition shadow-default "
      )}
    >
      <div className="size-full p-4 md:p-6 pr-4.5 flex flex-col gap-2 items-start z-1">
        <div className="flex gap-2 items-center">
          <IdenticonOrAvatar size="16" address={list.submitter} />
          <AddressOrName className="text-sm text-klerosUIComponentsPrimaryText" address={list.submitter} />
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="size-3.5" />
          <span className="text-klerosUIComponentsSecondaryText text-sm">{list.createdOn}</span>
        </div>
        <div className="w-full flex justify-between items-center">
          <small className="text-sm text-klerosUIComponentsPrimaryText">{list.transactions.length} Txns</small>
          <Status status={list.status} />
        </div>
      </div>
      {isHovered ? (
        <div
          role="button"
          className={clsx(
            "size-full absolute top-0 left-0 bg-klerosUIComponentsMediumBlue/90 z-2",
            "flex items-center justify-center gap-2 flex-col",
            "animate-fade-in !duration-100"
          )}
          onClick={toggleIsOpen}
        >
          <Search className="size-8" />
          <p className="text-base text-klerosUIComponentsSecondaryBlue">Examine</p>
        </div>
      ) : null}
      <ExamineModal {...{ isOpen, toggleIsOpen, list }} />
    </div>
  );
};

export default ListCard;
