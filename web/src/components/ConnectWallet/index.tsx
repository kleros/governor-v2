"use client";
import React, { useCallback } from "react";

import { useAppKit, useAppKitState } from "@reown/appkit/react";
import { useAccount, useSwitchChain } from "wagmi";

import { DEFAULT_CHAIN } from "@/consts";

import Button from "../Button";

export const SwitchChainButton: React.FC<{ className?: string }> = ({ className }) => {
  // @ts-expect-error  isLoading is not documented, but exists in the type, might have changed to isPending
  const { switchChain, isLoading } = useSwitchChain();
  const handleSwitch = useCallback(() => {
    if (!switchChain) {
      console.error("Cannot switch network. Please do it manually.");
      return;
    }
    try {
      switchChain({ chainId: DEFAULT_CHAIN.id });
    } catch (err) {
      console.error(err);
    }
  }, [switchChain]);
  return (
    <Button
      {...{ className }}
      // isLoading={isLoading}
      disabled={isLoading}
      onClick={handleSwitch}
    >{`Switch to ${DEFAULT_CHAIN.name}`}</Button>
  );
};

const ConnectButton: React.FC<{ className?: string }> = ({ className }) => {
  const { open } = useAppKit();
  const { open: isOpen } = useAppKitState();
  return (
    <Button
      {...{ className }}
      disabled={isOpen}
      // small
      onClick={async () => open({ view: "Connect" })}
    >
      Connect
    </Button>
  );
};

const ConnectWallet: React.FC<{ className?: string }> = ({ className }) => {
  const { isConnected, chainId } = useAccount();

  if (isConnected) {
    if (chainId !== DEFAULT_CHAIN.id) {
      return <SwitchChainButton {...{ className }} />;
    } else return <></>;
  } else return <ConnectButton {...{ className }} />;
};

export default ConnectWallet;
