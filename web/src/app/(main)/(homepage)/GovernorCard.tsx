import clsx from "clsx";
import Link from "next/link";

import ETH from "@/assets/svgs/tokens/eth.svg";

import { shortenAddress } from "@/utils/shortenAddress";

interface IGovernorCard {
  name: string;
  Logo: React.FC<React.SVGProps<SVGElement>>;
  address: string;
  chainId: number;
}

const GovernorCard: React.FC<IGovernorCard> = ({ name, Logo, address }) => {
  return (
    <Link
      href={"/"}
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground relative",
        "h-26.75 w-95.5 flex rounded-base border border-klerosUIComponentsStroke",
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
          "py-9.5 pl-6"
        )}
      >
        <Logo />
      </div>
      <div
        className={clsx(
          "w-[55%] bg-klerosUIComponentsMediumBlue rounded-base",
          "flex flex-col gap-1.5 pr-4 py-9.5 pl-8.5 justify-center"
        )}
      >
        <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">{name}</span>
        <div className="flex gap-2">
          <small className={clsx("text-klerosUIComponentsSecondaryText text-sm")}>{shortenAddress(address)}</small>
          <ETH className="size-6" />
        </div>
      </div>
    </Link>
  );
};

export default GovernorCard;
