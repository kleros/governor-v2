import React from "react";

import { useAccount } from "wagmi";

import { DEFAULT_CHAIN } from "@/consts";

import ConnectWallet from "./ConnectWallet";

interface IEnsureChain {
  children: React.ReactElement;
  className?: string;
}

export const EnsureChain: React.FC<IEnsureChain> = ({ children, className }) => {
  const { chainId } = useAccount();

  return chainId === DEFAULT_CHAIN.id ? children : <ConnectWallet {...{ className }} />;
};
