import { Address } from "viem";

import { ListTransaction } from "@/context/NewListsContext";

import { isUndefined } from "..";

type EncodeStateOverride = { stateOverrides: Record<Address, { value: Record<string, string> }> };

export const encodeStateOverride = async (
  networkId: number,
  governorAddress: Address,
  transactions: ListTransaction[]
) => {
  const accountSlug = process.env.TENDERLY_ACCOUNT_NAME;
  const projectSlug = process.env.TENDERLY_PROJECT_NAME;

  if (isUndefined(accountSlug) || isUndefined(projectSlug) || isUndefined(process.env.TENDERLY_ACCESS_KEY)) {
    throw new Error("Encoding state overrides: Environment variables not configured.");
  }

  const url = `https://api.tenderly.co/api/v1/account/${accountSlug}/project/${projectSlug}/contracts/encode-states`;

  const stateObject = buildTenderlyEncodeStateBody(networkId, governorAddress, transactions);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": process.env.TENDERLY_ACCESS_KEY,
    },
    body: JSON.stringify(stateObject),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Encoding state overrides failed: ${res.status} ${errorText}`);
  }

  const result = await res.json();

  return result as EncodeStateOverride;
};

export const buildTenderlyEncodeStateBody = (
  networkId: number,
  governorAddress: Address,
  txs: ListTransaction[] = []
) => {
  // we will overwrite the list id 0
  const submissionPrefix = `submissions[0]`;
  const value = {};

  value[`${submissionPrefix}.approved`] = "true";
  // current time - 10 sec
  value[`${submissionPrefix}.approvalTime`] = Math.floor(Date.now() / 1000 - 10).toString();

  // Add txs dynamically
  txs.forEach((tx, i) => {
    value[`${submissionPrefix}.txs[${i}].target`] = tx.to;
    value[`${submissionPrefix}.txs[${i}].data`] = tx.data;
    value[`${submissionPrefix}.txs[${i}].value`] = tx.txnValue;
  });

  return {
    networkID: networkId.toString(),
    stateOverrides: {
      [governorAddress]: {
        value,
      },
    },
  };
};
