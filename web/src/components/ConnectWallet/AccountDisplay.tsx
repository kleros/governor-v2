import React from "react";

import clsx from "clsx";
import Image from "next/image";
import Identicon from "react-identicons";
import { useToggle } from "react-use";
import { isAddress } from "viem";
import { normalize } from "viem/ens";

import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import { shortenAddress } from "@/utils/shortenAddress";

import AccountDetails from "./AccountDetails";

interface IIdenticonOrAvatar {
  size?: `${number}`;
  address?: `0x${string}`;
}

export const IdenticonOrAvatar: React.FC<IIdenticonOrAvatar> = ({ size = "16", address: propAddress }) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data: name } = useEnsName({
    address,
    chainId: 1,
  });
  const { data: avatar } = useEnsAvatar({
    name: normalize(name ?? ""),
    chainId: 1,
  });

  return avatar ? (
    <Image className="items-center object-cover rounded-[50%]" src={avatar} alt="avatar" width={size} height={size} />
  ) : (
    <div className="items-center" style={{ width: size + "px", height: size + "px" }}>
      <Identicon size={size} string={address} />
    </div>
  );
};

interface IAddressOrName {
  address?: `0x${string}`;
  className?: string;
}

export const AddressOrName: React.FC<IAddressOrName> = ({ address: propAddress, className }) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data } = useEnsName({
    address,
    chainId: 1,
  });

  return <label {...{ className }}>{data ?? (isAddress(address!) ? shortenAddress(address) : address)}</label>;
};

export const ChainDisplay: React.FC = () => {
  const { chain } = useAccount();

  return (
    <small
      className={clsx(
        "text-klerosUIComponentsSuccess text-base relative ml-4",
        "before:-left-4 before:top-1/2 before:-translate-y-1/2 before:absolute",
        "before:size-2 before:bg-klerosUIComponentsSuccess before:rounded-full"
      )}
    >
      {chain?.name}
    </small>
  );
};

const AccountDisplay: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  return (
    <>
      <div
        className={clsx(
          "bg-whiteLowOpacitySubtle transition ease-ease hover:bg-whiteLowOpacityStrong cursor-pointer rounded-[300px]",
          "flex content-center justify-between items-center px-3"
        )}
        onClick={toggleIsOpen}
      >
        <div className="min-h-8 flex items-center w-fit gap-3">
          <IdenticonOrAvatar size="24" />
          <AddressOrName
            className={clsx("text-white/80 text-sm hover:text-white", "transition-colors duration-200 cursor-pointer")}
          />
        </div>
      </div>
      <AccountDetails {...{ isOpen, toggleIsOpen }} />
    </>
  );
};

export default AccountDisplay;
