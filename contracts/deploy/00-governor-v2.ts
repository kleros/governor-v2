import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";
import { getArbitratorContracts } from "./utils/getContracts";
import { GovernorFactory } from "../typechain-types";
import { dataMappings, templateFn } from "./utils/disputeTemplate";

// General court, 3 jurors
const extraData =
  "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId, ethers, network } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const wNative = await ethers.getContract("WETH");

  const { disputeTemplateRegistry, klerosCore } = await getArbitratorContracts(hre);
  const disputeTemplate = templateFn(klerosCore.target.toString(), chainId);

  await deploy("GovernorFactory", {
    from: deployer,
    log: true,
  });

  const governorFactory = await ethers.getContract<GovernorFactory>("GovernorFactory");

  const gfArgs = [
    klerosCore.target,
    extraData,
    disputeTemplateRegistry.target,
    disputeTemplate,
    dataMappings,
    0,
    600,
    600,
    600, // feeTimeout: 10 minutes
    wNative.target,
  ];

  await governorFactory.deploy(
    klerosCore.target,
    extraData,
    disputeTemplateRegistry.target,
    disputeTemplate,
    dataMappings,
    0,
    600,
    600,
    600, // feeTimeout: 10 minutes,
    wNative.target
  );

  const kgArgs = gfArgs;
  await deploy("KlerosGovernor", {
    from: deployer,
    args: kgArgs,
    log: true,
  });
};

deploy.tags = ["KlerosGovernor"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
