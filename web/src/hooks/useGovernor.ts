import { createUseReadContract } from "wagmi/codegen";

import { klerosGovernorAbi } from "./contracts/generated";
export const useReadLastApprovalTime = createUseReadContract({
  abi: klerosGovernorAbi,
  functionName: "lastApprovalTime",
});
export const useReadGetCurrentSessionNumber = createUseReadContract({
  abi: klerosGovernorAbi,
  functionName: "getCurrentSessionNumber",
});
export const useReadGetSession = createUseReadContract({ abi: klerosGovernorAbi, functionName: "getSession" });
