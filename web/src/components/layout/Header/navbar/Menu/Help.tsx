import React from "react";

import { Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";

import Guide from "@/assets/svgs/icons/book.svg";
import Bug from "@/assets/svgs/icons/bug.svg";
import ETH from "@/assets/svgs/icons/eth.svg";
import Faq from "@/assets/svgs/menu-icons/help.svg";
import Telegram from "@/assets/svgs/socialmedia/telegram.svg";

const ITEMS = [
  {
    text: "Get Help",
    Icon: Telegram,
    url: "https://t.me/kleros",
  },
  {
    text: "Report a Bug",
    Icon: Bug,
    url: "https://github.com/kleros/governor-v2/issues",
  },
  {
    text: "DApp Guide",
    Icon: Guide,
    url: "https://docs.kleros.io/products/governor",
  },
  {
    text: "Crypto Beginner's Guide",
    Icon: ETH,
    url: "https://ethereum.org/en/wallets/",
  },
  {
    text: "FAQ",
    Icon: Faq,
    url: "https://docs.kleros.io/kleros-faq",
  },
];

interface IHelp {
  isOpen?: boolean;
  toggleIsHelpOpen: () => void;
}
const Help: React.FC<IHelp> = ({ isOpen, toggleIsHelpOpen }) => {
  return (
    <Modal
      className={clsx(
        "overflow-y-auto max-h-[80vh] max-w-111 w-65 p-3 pr-6 mt-18 h-auto",
        "flex flex-col absolute top-0 right-0 left-auto",
        "shadow-default rounded-base border border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground",
        "animate-slide-in-left"
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsHelpOpen}
      isDismissable
    >
      <div className="size-full" role="menu"></div>
      {ITEMS.map(({ text, Icon, url }) => (
        <Link
          className={clsx(
            "flex gap-2 py-3 px-2 cursor-pointer items-center",
            " transition-transform duration-200 hover:scale-102"
          )}
          href={url}
          key={text}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          aria-label={`${text} - opens in new tab`}
        >
          <Icon className="inline-block size-4 fill-klerosUIComponentsSecondaryPurple" />
          <small
            className={clsx(
              "text-base text-klerosUIComponentsSecondaryText hover:text-klerosUIComponentsSecondaryPurple",
              "transition-colors duration-200 hover:text-klerosUIComponentsSecondaryPurple"
            )}
          >
            {text}
          </small>
        </Link>
      ))}
    </Modal>
  );
};
export default Help;
