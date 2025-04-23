"use client";

import { useRef } from "react";

import clsx from "clsx";
import { useHoverDirty } from "react-use";

import { AddressOrName, IdenticonOrAvatar } from "@/components/ConnectWallet/AccountDisplay";

import Calendar from "@/assets/svgs/icons/calendar.svg";
import Search from "@/assets/svgs/icons/search.svg";

import Status from "../Status";

const ListCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHovered = useHoverDirty(cardRef);

  return (
    <div
      ref={cardRef}
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground",
        "w-95.5 min-w-75.5 h-30.5 cursor-pointer relative rounded-base",
        "border border-klerosUIComponentsStroke hover-short-transition shadow-default "
      )}
    >
      <div className="size-full  p-6 pr-4.5 flex flex-col gap-2 items-start z-1">
        <div className="flex gap-2 items-center">
          <IdenticonOrAvatar size="16" />
          <AddressOrName className="text-sm text-klerosUIComponentsPrimaryText" />
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="size-3.5" />
          <span className="text-klerosUIComponentsSecondaryText text-sm">Tuesday, February 18, 2025</span>
        </div>
        <div className="w-full flex justify-between items-center">
          <small className="text-sm text-klerosUIComponentsPrimaryText">3 Txns</small>
          <Status status={1} />
        </div>
      </div>
      {isHovered ? (
        <div
          className={clsx(
            "size-full absolute top-0 left-0 bg-klerosUIComponentsMediumBlue/90 z-2",
            "flex items-center justify-center gap-2 flex-col",
            "animate-fade-in !duration-100"
          )}
        >
          <Search className="size-8" />
          <p className="text-base text-klerosUIComponentsSecondaryBlue">Examine</p>
        </div>
      ) : null}
    </div>
  );
};

export default ListCard;
