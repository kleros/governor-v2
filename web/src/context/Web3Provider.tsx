"use client";

import { projectId, wagmiAdapter } from "@/web3Config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { isProductionDeployment, SUPPORTED_CHAINS } from "@/consts";
import { arbitrum, arbitrumSepolia } from "@reown/appkit/networks";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: SUPPORTED_CHAINS,
  defaultNetwork: isProductionDeployment() ? arbitrum : arbitrumSepolia,
});

function Web3Provider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Provider;
