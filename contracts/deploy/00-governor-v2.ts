import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HomeChains, isSkipped } from "./utils";
import { getContracts } from "./utils/getContracts";
import { GovernorFactory } from "../typechain-types";

const disputeTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Let's do this",
  "description": "We want to do this: %s",
  "question": "Does it comply with the policy?",
  "answers": [
    {
      "title": "Yes",
      "description": "Select this if you agree that it must be done."
    },
    {
      "title": "No",
      "description": "Select this if you do not agree that it must be done."
    }
  ],
  "policyURI": "/ipfs/Qmdvk...rSD6cE/policy.pdf",
  "frontendUrl": "https://kleros-v2.netlify.app/#/cases/%s/overview",
  "arbitratorChainID": "421614",
  "arbitratorAddress": "0xD08Ab99480d02bf9C092828043f611BcDFEA917b",
  "category": "Others",
  "specification": "KIP001",
  "lang": "en_US"
}
`;

// General court, 3 jurors
const extraData =
  "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, getChainId, ethers } = hre;
  const { deploy } = deployments;

  // fallback to hardhat node signers on local network
  const deployer = (await getNamedAccounts()).deployer ?? (await hre.ethers.getSigners())[0].address;
  const chainId = Number(await getChainId());
  console.log("deploying to %s with deployer %s", HomeChains[chainId], deployer);

  const { disputeTemplateRegistry, klerosCore } = await getContracts(hre);

  await deploy("GovernorFactory", {
    from: deployer,
    log: true,
  });

  const governorFactory = (await ethers.getContract("GovernorFactory")) as GovernorFactory;
  await governorFactory.deploy(
    klerosCore.target,
    extraData,
    disputeTemplateRegistry.target,
    disputeTemplate,
    "",
    0,
    600,
    600,
    600 // feeTimeout: 10 minutes
  );

  await deploy("KlerosGovernor", {
    from: deployer,
    args: [
      klerosCore.target,
      extraData,
      disputeTemplateRegistry.target,
      disputeTemplate,
      "",
      0,
      600,
      600,
      600, // feeTimeout: 10 minutes
    ],
    log: true,
  });
};

deploy.tags = ["KlerosGovernor"];
deploy.skip = async ({ network }) => {
  return isSkipped(network, !HomeChains[network.config.chainId ?? 0]);
};

export default deploy;
