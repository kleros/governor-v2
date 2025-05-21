import { Button, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";

import { useAccount, useDisconnect } from "wagmi";

import ConnectWallet from "@/components/ConnectWallet";
import { CopiableAddressDisplay } from "@/components/ConnectWallet/AccountDetails";
import { ChainDisplay, IdenticonOrAvatar } from "@/components/ConnectWallet/AccountDisplay";
import LightButton from "@/components/LightButton";

import HamburgerIcon from "@/assets/svgs/header/hamburger.svg";
import HelpIcon from "@/assets/svgs/menu-icons/help.svg";
import KlerosSolutionsIcon from "@/assets/svgs/menu-icons/kleros-solutions.svg";

import Logo from "./Logo";

interface IMobileNavbar {
  toggleIsDappListOpen: () => void;
  toggleIsHelpOpen: () => void;
}

const MobileNavbar: React.FC<IMobileNavbar> = ({ toggleIsDappListOpen, toggleIsHelpOpen }) => {
  const { isConnected } = useAccount();
  const [isMenuOpen, toggleIsMenuOpen] = useToggle(false);
  const { disconnect } = useDisconnect();

  return (
    <>
      <div className="h-16 flex md:!hidden relative w-full items-center justify-between">
        <Logo />
        <LightButton
          text=""
          icon={<HamburgerIcon className="[&_path]:fill-white/75 hover:[&_path]:fill-white" />}
          onClick={toggleIsMenuOpen}
        />
      </div>
      <Modal
        className={clsx(
          "overflow-y-auto max-h-[80vh] w-full px-6 py-8 mt-16 h-auto",
          "flex flex-col gap-6 absolute top-0 left-0",
          "shadow-default rounded-base border border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground",
          "animate-slide-in-top"
        )}
        isOpen={isMenuOpen}
        onOpenChange={toggleIsMenuOpen}
        isDismissable
      >
        <div className="flex gap-2 w-full items-center">
          <LightButton
            className="[&>p]:text-klerosUIComponentsPrimaryText [&>p]:ml-2"
            text="Kleros Solutions"
            icon={<KlerosSolutionsIcon />}
            onPress={toggleIsDappListOpen}
          />
        </div>

        <hr className="border-klerosUIComponentsStroke w-full" />

        <div className="flex justify-between gap-4 flex-wrap items-center">
          {isConnected ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <IdenticonOrAvatar size="24" />
                  <CopiableAddressDisplay />
                </div>
                <ChainDisplay />
              </div>
              <Button small variant="primary" text="Disconnect" onPress={() => disconnect()} />
            </>
          ) : (
            <ConnectWallet />
          )}
        </div>

        <hr className="border-klerosUIComponentsStroke w-full" />

        <LightButton
          className="[&>p]:text-klerosUIComponentsPrimaryText [&>p]:ml-2"
          text="Help"
          icon={<HelpIcon className="size-4" />}
          onPress={toggleIsHelpOpen}
        />
      </Modal>
    </>
  );
};

export default MobileNavbar;
