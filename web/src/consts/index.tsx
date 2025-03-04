import { mainnet, arbitrum, arbitrumSepolia, type AppKitNetwork } from "@reown/appkit/networks";

export const isProductionDeployment = () => process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "mainnet";

export const SUPPORTED_CHAINS: [AppKitNetwork, ...AppKitNetwork[]] = isProductionDeployment()
  ? [mainnet, arbitrum]
  : [mainnet, arbitrumSepolia];

export const DEFAULT_CHAIN = isProductionDeployment() ? arbitrum : arbitrumSepolia;
