import clsx from "clsx";
import Link from "next/link";

import ConnectWallet from "@/components/ConnectWallet";
import LightButton from "@/components/LightButton";

import HelpIcon from "@/assets/svgs/menu-icons/help.svg";
import KlerosSolutionsIcon from "@/assets/svgs/menu-icons/kleros-solutions.svg";

import Logo from "./Logo";

interface IDesktopNavbar {
  toggleIsDappListOpen: () => void;
  toggleIsHelpOpen: () => void;
}

const DesktopNavbar: React.FC<IDesktopNavbar> = ({ toggleIsDappListOpen, toggleIsHelpOpen }) => {
  return (
    <div className="h-16 hidden md:flex relative w-full items-center justify-between">
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
        <ConnectWallet />
        <LightButton
          text=""
          onClick={toggleIsHelpOpen}
          icon={<HelpIcon className="size-4" />}
          className="min-h-8 flex items-center "
        />
      </div>
    </div>
  );
};

export default DesktopNavbar;
