import { Button, Copiable, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";

import { useAccount, useDisconnect } from "wagmi";

import { AddressOrName, IdenticonOrAvatar } from "./AccountDisplay";

interface IAccountDetails {
  isOpen?: boolean;
  toggleIsOpen: () => void;
}
const AccountDetails: React.FC<IAccountDetails> = ({ isOpen, toggleIsOpen }) => {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const explorerUrl = `${chain?.blockExplorers?.default.url}/address/${address}`;

  return (
    <Modal
      isDismissable
      className={clsx(
        "top-0 right-2 left-auto absolute h-auto w-75.5",
        "flex flex-col py-8 px-4 mt-18 gap-4 items-center justify-center",
        "shadow-default rounded-base border border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground",
        "animate-slide-in-left z-40"
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsOpen}
    >
      <IdenticonOrAvatar size="56" />
      <Copiable copiableContent={address ?? ""} tooltipProps={{ small: true }}>
        <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
          <AddressOrName
            className={clsx(
              "text-klerosUIComponentsPrimaryText hover:underline hover:text-klerosUIComponentsPrimaryBlue",
              "cursor-pointer"
            )}
          />
        </Link>
      </Copiable>
      <small
        className={clsx(
          "text-klerosUIComponentsSuccess text-base relative",
          "before:-left-4 before:top-1/2 before:-translate-y-1/2 before:absolute",
          "before:size-2 before:bg-klerosUIComponentsSuccess before:rounded-full"
        )}
      >
        {chain?.name}
      </small>
      <Button variant="secondary" small text="Disconnect" onPress={() => disconnect()} />
    </Modal>
  );
};

export default AccountDetails;
