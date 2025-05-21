import clsx from "clsx";
import Link from "next/link";

import { shortenAddress } from "@/utils/shortenAddress";

import { Governor } from "@/consts/governors";

const GovernorCard: React.FC<Governor> = ({ name, Logo, address, ChainIcon }) => {
  return (
    <Link
      href={`/governor/${address}`}
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground relative",
        "h-26.75 min-w-75 max-w-95.5 flex rounded-base border border-klerosUIComponentsStroke",
        "hover:shadow-default hover:cursor-pointer hover:scale-101 transition ease-ease"
      )}
    >
      <div
        className={clsx(
          "w-[45%] relative",
          "before:size-0 before:absolute",
          "before:-right-[38px] before:top-1/2 before:-translate-y-1/2 before:rounded-tl-md",
          "before:border-x-20 before:border-y-[53.5px] before:border-l-klerosUIComponentsWhiteBackground",
          "before:border-r-transparent before:border-t-transparent before:border-b-transparent",
          "pl-2 py-9.5 sm:pl-6"
        )}
      >
        <Logo />
      </div>
      <div
        className={clsx(
          "w-[55%] bg-klerosUIComponentsMediumBlue rounded-base",
          "flex flex-col gap-1.5 pr-2 sm:pr-4 py-9.5 pl-6.5 sm:pl-8.5 justify-center"
        )}
      >
        <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">{name}</span>
        <div className="flex gap-2">
          <small className={clsx("text-klerosUIComponentsSecondaryText text-sm")}>{shortenAddress(address)}</small>
          <ChainIcon className="size-6" />
        </div>
      </div>
    </Link>
  );
};

export default GovernorCard;
