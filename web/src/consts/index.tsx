import { mainnet, arbitrum, arbitrumSepolia, type AppKitNetwork, Chain } from "@reown/appkit/networks";

export const isProductionDeployment = () => process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "mainnet";

export const SUPPORTED_CHAINS: [AppKitNetwork, ...AppKitNetwork[]] = isProductionDeployment()
  ? [mainnet, arbitrum]
  : [mainnet, arbitrumSepolia];

export const DEFAULT_CHAIN: Chain = isProductionDeployment() ? arbitrum : arbitrumSepolia;

export const COURT_SITE = process.env.NEXT_PUBLIC_COURT_SITE ?? "https://v2.kleros.builders/#";
