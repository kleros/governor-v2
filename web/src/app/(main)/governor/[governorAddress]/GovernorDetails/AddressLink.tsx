"use client";

import { Copiable } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";

import { Governor } from "@/consts/governors";

import { shortenAddress } from "@/utils/shortenAddress";

const AddressLink: React.FC<{ address: Governor["address"]; chain: Governor["chain"] }> = ({ address, chain }) => {
  const explorerUrl = `${chain.blockExplorers?.default.url}/address/${address}`;
  return (
    <Copiable copiableContent={address} tooltipProps={{ small: true }}>
      <Link
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "text-klerosUIComponentsSecondaryText cursor-pointer",
          "hover:text-klerosUIComponentsPrimaryBlue hover:underline"
        )}
      >
        {shortenAddress(address)}
      </Link>
    </Copiable>
  );
};

export default AddressLink;
