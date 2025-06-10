import { createUseReadContract, createUseSimulateContract, createUseWriteContract } from "wagmi/codegen";

import { klerosGovernorAbi } from "./contracts/generated";

//***************** Read *************************/
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
export const useReadTotalSubmissionDeposit = createUseReadContract({
  abi: klerosGovernorAbi,
  functionName: "getTotalSubmissionDeposit",
});

//***************** Write/Simulate *************************/
export const useSimulateExecuteSubmissions = createUseSimulateContract({
  abi: klerosGovernorAbi,
  functionName: "executeSubmissions",
});
export const useWriteExecuteSubmissions = createUseWriteContract({
  abi: klerosGovernorAbi,
  functionName: "executeSubmissions",
});

export const useSimulateSubmitList = createUseSimulateContract({
  abi: klerosGovernorAbi,
  functionName: "submitList",
});
export const useWriteSubmitList = createUseWriteContract({
  abi: klerosGovernorAbi,
  functionName: "submitList",
});

export const useSimulateWithdrawTransactionList = createUseSimulateContract({
  abi: klerosGovernorAbi,
  functionName: "withdrawTransactionList",
});
export const useWriteWithdrawTransactionList = createUseWriteContract({
  abi: klerosGovernorAbi,
  functionName: "withdrawTransactionList",
});
