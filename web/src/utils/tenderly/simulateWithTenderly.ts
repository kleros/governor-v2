import { Address, padHex, parseEther, toHex } from "viem";

import { ListTransaction } from "@/context/NewListsContext";

import { isUndefined } from "..";

import { encodeStateOverride } from "./encodeState";

export type SimulationResult = {
  simulation: {
    id: string;
    status: boolean;
  };
  transaction: {
    status: boolean;
  };
};

// function executeTransactionList( _listID: "0", _cursor: "0", _count: "0")
const encodedExecuteTransactionListFunction =
  // eslint-disable-next-line max-len
  "0x6cf39c2b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

export const simulateWithTenderly = async (
  networkId: number,
  governorAddress: Address,
  transactions: ListTransaction[]
) => {
  const accountSlug = process.env.TENDERLY_ACCOUNT_NAME;
  const projectSlug = process.env.TENDERLY_PROJECT_NAME;

  if (isUndefined(accountSlug) || isUndefined(projectSlug) || isUndefined(process.env.TENDERLY_ACCESS_KEY)) {
    throw new Error("Tenderly simulation failed: Environment variables not configured.");
  }

  const url = `https://api.tenderly.co/api/v1/account/${accountSlug}/project/${projectSlug}/simulate`;

  const encodedStateOverride = await encodeStateOverride(networkId, governorAddress, transactions);

  const simulationsPayload = {
    network_id: networkId,
    save: true,
    save_if_fails: true,
    shared: true,
    simulation_type: "full", // "quick" for a less detailed one
    from: "0x97e9fbbe563d3b3917a0b446f95afe0071c2322f", // dummy address
    to: governorAddress,
    gas_price: "0",
    value: "0",
    input: encodedExecuteTransactionListFunction,
    state_objects: {
      [governorAddress.toLowerCase()]: {
        balance: parseEther("100").toString(),
        storage: {
          ...encodedStateOverride.stateOverrides[governorAddress.toLowerCase()].value,
          // submission.txs.length
          "0xc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2aa": padHex(toHex(transactions.length), {
            size: 32,
          }),
        },
      },
    },
    // block_header: {
    //   timestamp: "0x0", // 0
    // },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": process.env.TENDERLY_ACCESS_KEY,
    },
    body: JSON.stringify(simulationsPayload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Tenderly simulation failed: ${res.status} ${errorText}`);
  }

  const result = await res.json();

  const id = result.simulation.id;
  await enableSharing(id);
  return result as SimulationResult;
};

// enable sharing the txn
const enableSharing = async (id: string) => {
  const accountSlug = process.env.TENDERLY_ACCOUNT_NAME;
  const projectSlug = process.env.TENDERLY_PROJECT_NAME;

  if (isUndefined(accountSlug) || isUndefined(projectSlug) || isUndefined(process.env.TENDERLY_ACCESS_KEY)) {
    throw new Error("Sharing simulation failed: Environment variables not configured.");
  }

  const url = `https://api.tenderly.co/api/v1/account/${accountSlug}/project/${projectSlug}/simulations/${id}/share`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": process.env.TENDERLY_ACCESS_KEY,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Sharing simulation failed: ${res.status} ${errorText}`);
  }
};
