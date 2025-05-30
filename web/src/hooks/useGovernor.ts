import { createUseReadContract, createUseSimulateContract, createUseWriteContract } from "wagmi/codegen";

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
export const useReadSubmissionTimeout = createUseReadContract({
  abi: klerosGovernorAbi,
  functionName: "submissionTimeout",
});

export const useSimulateExecuteSubmissions = createUseSimulateContract({
  abi: klerosGovernorAbi,
  functionName: "executeSubmissions",
});
export const useWriteExecuteSubmissions = createUseWriteContract({
  abi: klerosGovernorAbi,
  functionName: "executeSubmissions",
});
