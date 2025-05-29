import clsx from "clsx";
import Link from "next/link";

import Snapshot from "@/assets/svgs/icons/snapshot.svg";

import { Governor } from "@/consts/governors";

import AddressLink from "./AddressLink";
import SessionInfo from "./SessionInfo";

const GovernorDetailsCard: React.FC<Governor> = ({ address, chain, Logo, ChainIcon, snapshotSlug }) => {
  return (
    <div className="w-full">
      <div className="h-1.25 rounded-t-base bg-klerosUIComponentsPrimaryBlue  w-full" />
      <div
        className={clsx(
          "w-full bg-klerosUIComponentsWhiteBackground min-h-35.5",
          "border border-klerosUIComponentsStroke rounded-b-base !border-t-transparent",
          "p-4 md:p-8 flex flex-col"
        )}
      >
        <div className="flex flex-wrap gap-y-2 justify-between">
          <Logo />
          <div className="flex gap-6 items-center">
            <AddressLink {...{ address, chain }} />
            <ChainIcon className="size-6" />
          </div>
        </div>
        <hr className="h-0.25 border-klerosUIComponentsStroke my-4" />
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex gap-2 items-start md:items-center">
            <Snapshot className="size-4 shrink-0" />
            <small className="text-sm text-klerosUIComponentsSecondaryText">
              Governor decisions from{" "}
              <Link
                href={`https://snapshot.org/#/${snapshotSlug}`}
                target="_blank"
                rel="noreferrer nooppener"
                className="text-klerosUIComponentsPrimaryBlue"
              >
                Snapshot
              </Link>
            </small>
          </div>
          <SessionInfo {...{ address }} />
        </div>
      </div>
    </div>
  );
};

export default GovernorDetailsCard;
