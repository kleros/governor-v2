import { mainnet, arbitrum, arbitrumSepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { fallback, http, webSocket } from "wagmi";

import { DEFAULT_CHAIN, isProductionDeployment } from "@/consts";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
if (!alchemyApiKey) {
  throw new Error("Alchemy API key is not set in NEXT_PUBLIC_ALCHEMY_API_KEY environment variable.");
}

// https://github.com/alchemyplatform/alchemy-sdk-js/blob/c4440cb/src/types/types.ts#L98-L153
const alchemyToViemChain: Record<number, string> = {
  [arbitrumSepolia.id]: "arb-sepolia",
  [arbitrum.id]: "arb-mainnet",
  [mainnet.id]: "eth-mainnet",
};

type AlchemyProtocol = "https" | "wss";

// https://github.com/alchemyplatform/alchemy-sdk-js/blob/c4440cb/src/util/const.ts#L16-L18
function alchemyURL(protocol: AlchemyProtocol, chainId: number | string): string {
  const network = alchemyToViemChain[chainId];
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return `${protocol}://${network}.g.alchemy.com/v2/${alchemyApiKey}`;
}

export const getChainRpcUrl = (protocol: AlchemyProtocol, chainId: number | string) => {
  return alchemyURL(protocol, chainId);
};

export const getDefaultChainRpcUrl = (protocol: AlchemyProtocol) => {
  return getChainRpcUrl(protocol, DEFAULT_CHAIN.id);
};
const isProduction = isProductionDeployment();

export const getTransports = () => {
  const alchemyTransport = (chain: AppKitNetwork) =>
    fallback([http(alchemyURL("https", chain.id)), webSocket(alchemyURL("wss", chain.id))]);

  return {
    [isProduction ? arbitrum.id : arbitrumSepolia.id]: isProduction
      ? alchemyTransport(arbitrum)
      : alchemyTransport(arbitrumSepolia),
    [mainnet.id]: alchemyTransport(mainnet),
  };
};
