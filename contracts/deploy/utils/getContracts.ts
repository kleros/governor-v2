import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeploymentName, getContractsEthers as _getArbitratorContracts } from "@kleros/kleros-v2-contracts";
import { KlerosGovernor } from "../../typechain-types";

const NETWORK_TO_DEPLOYMENT: Record<string, DeploymentName> = {
  arbitrumSepoliaDevnet: "devnet",
  arbitrumSepolia: "testnet",
  arbitrum: "mainnet",
} as const;

export const getArbitratorContracts = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, deployments } = hre;
  const networkName = deployments.getNetworkName();
  const deploymentName = NETWORK_TO_DEPLOYMENT[networkName];
  if (!deploymentName)
    throw new Error(
      `Unsupported network: ${networkName}. Supported networks: ${Object.keys(NETWORK_TO_DEPLOYMENT).join(", ")}`
    );
  return await _getArbitratorContracts(ethers.provider, deploymentName);
};

export const getContracts = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers } = hre;
  const { klerosCore, disputeTemplateRegistry } = await getArbitratorContracts(hre);
  const governor = await ethers.getContract<KlerosGovernor>("KlerosGovernor");
  return { governor, disputeTemplateRegistry, klerosCore };
};
