import { cookieStorage, createStorage } from "@wagmi/core";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

import { SUPPORTED_CHAINS } from "@/consts";

import { getTransports } from "./rpc";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks: SUPPORTED_CHAINS,
  transports: getTransports(),
});

export const config = wagmiAdapter.wagmiConfig;
