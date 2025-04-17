"use client";
import clsx from "clsx";
import Link from "next/link";
import { useToggle } from "react-use";

import { useAccount } from "wagmi";

import ConnectWallet from "@/components/ConnectWallet";
import LightButton from "@/components/LightButton";

import HelpIcon from "@/assets/svgs/menu-icons/help.svg";
import KlerosSolutionsIcon from "@/assets/svgs/menu-icons/kleros-solutions.svg";

import { DEFAULT_CHAIN } from "@/consts";

import DappList from "./navbar/DappList";
import Help from "./navbar/Menu/Help";

import Logo from "./Logo";

const Header: React.FC = () => {
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const { isConnected, chainId } = useAccount();
  const isDefaultChain = chainId === DEFAULT_CHAIN.id;

  return (
    <div
      className={clsx("bg-klerosUIComponentsLightBlue/65 backdrop-blur-md", "flex wrap sticky z-10 top-0 w-full px-6")}
    >
      <div className="h-16 relative w-full flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex items-center">
            <LightButton text="" icon={<KlerosSolutionsIcon />} onPress={toggleIsDappListOpen} />
          </div>
          <Logo />
        </div>
        <div className="flex absolute left-1/2 top-1/2 -translate-1/2">
          <Link
            className={clsx(
              "flex items-center",
              "text-base text-klerosUIComponentsPrimaryText/75 hover:text-klerosUIComponentsPrimaryText "
            )}
            href="/"
          >
            Governors
          </Link>
        </div>

        <div className="flex gap-1 md:gap-2 ml-2">
          <div {...{ isConnected, isDefaultChain }} onClick={isConnected && isDefaultChain ? undefined : undefined}>
            <ConnectWallet />
          </div>
          <LightButton
            text=""
            onClick={toggleIsHelpOpen}
            icon={<HelpIcon className="size-4" />}
            className="min-h-8 flex items-center "
          />
        </div>
      </div>

      <Help {...{ toggleIsHelpOpen, isOpen: isHelpOpen }} />
      <DappList {...{ toggleIsDappListOpen, isOpen: isDappListOpen }} />
    </div>
  );
};

export default Header;
