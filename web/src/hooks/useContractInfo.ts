"use client";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, isAddress } from "viem";

import { isUndefined } from "@/utils";

import { DEFAULT_CHAIN } from "@/consts";

export type ContractInfo = {
  address: Address;
  name?: string | null;
  abi: Abi;
};

/**
 * Hook to fetch contract details from Tenderly API
 * @param networkId - The network ID
 * @param contractAddress - The contract address
 */
export const useContractInfo = (contractAddress?: Address, networkId = DEFAULT_CHAIN.id) => {
  return useQuery<ContractInfo | null>({
    queryKey: [`contract-info-${networkId}-${contractAddress}`],
    enabled: !isUndefined(networkId) && !isUndefined(contractAddress) && isAddress(contractAddress),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    queryFn: async () => {
      if (isUndefined(networkId) || isUndefined(contractAddress)) return null;

      try {
        const response = await fetch(`/api/contract?networkId=${networkId}&contractAddress=${contractAddress}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch contract details: ${response.status} ${errorText}`);
        }

        const contractDetails = await response.json();
        return contractDetails;
      } catch (error) {
        console.error("Contract fetch error:", error instanceof Error ? error.message : "Unknown error");
        throw error;
      }
    },
  });
};
