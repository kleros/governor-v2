import { readdir, readFile } from "fs/promises";
import { parse, join } from "path";

import { type Config, type ContractConfig, defineConfig } from "@wagmi/cli";
import dotenv from "dotenv";
import { type Chain } from "viem";

dotenv.config();

const readArtifacts = async (viemChainName: string, hardhatChainName?: string) => {
  const chains = await import("wagmi/chains");
  const chain = chains[viemChainName] as Chain;
  if (!chain) {
    throw new Error(`Viem chain ${viemChainName} not found`);
  }

  const directoryPath = `../contracts/deployments/${hardhatChainName ?? viemChainName}`;
  const files = await readdir(directoryPath);

  const results: ContractConfig[] = [];
  for (const file of files) {
    const { name, ext } = parse(file);
    if (ext === ".json") {
      const filePath = join(directoryPath, file);
      const fileContent = await readFile(filePath, "utf-8");
      const jsonContent = JSON.parse(fileContent);
      results.push({
        name: name,
        address: {
          [chain.id]: jsonContent.address as `0x{string}`,
        },
        abi: jsonContent.abi,
      });
    }
  }
  return results;
};

const getConfig = async (): Promise<Config> => {
  const deployment = process.env.NEXT_PUBLIC_APP_DEPLOYMENT ?? "devnet";

  let viemNetwork: string;
  let hardhatNetwork: string;
  switch (deployment) {
    case "devnet":
      viemNetwork = "arbitrumSepolia";
      hardhatNetwork = "arbitrumSepoliaDevnet";
      break;
    case "testnet":
      viemNetwork = "arbitrumSepolia";
      hardhatNetwork = "arbitrumSepolia";
      break;
    case "mainnet":
      viemNetwork = "arbitrum";
      hardhatNetwork = "arbitrum";
      break;
    default:
      throw new Error(`Unknown deployment ${deployment}`);
  }

  const deploymentContracts = await readArtifacts(viemNetwork, hardhatNetwork);

  return {
    out: "src/hooks/contracts/generated.ts",
    contracts: [...deploymentContracts],
    // we create hooks manually in hooks/useGovernor.ts to allow overriding `address` property
    // reference : https://github.com/wevm/wagmi/discussions/4241
    // un-comment to generate react hooks
    // plugins: [react(), actions()],
  };
};

type MaybeArray<T> = T | T[];

type MaybePromise<T> = T | Promise<T>;

const config: MaybeArray<Config> | (() => MaybePromise<MaybeArray<Config>>) = defineConfig(getConfig);

export default config;
