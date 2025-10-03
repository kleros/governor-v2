import { Address, Hex } from "viem";

import { ListTransaction } from "@/context/LIstsContext";

export const constructSubmissionData = (transactions: ListTransaction[]) => {
  const addresses: Address[] = [];
  const values: bigint[] = [];
  let data: Hex = "0x";
  const dataSizes: bigint[] = [];
  let titles = "";

  // at this point the data is sanitized, so we don't need redundant checks
  transactions.forEach((txn, index) => {
    addresses.push(txn.to);
    values.push(BigInt(txn.txnValue));
    dataSizes.push(BigInt(txn.data.slice(2).length / 2));
    titles += index === transactions.length - 1 ? txn.name : txn.name.concat(",");

    data += txn.data.slice(2); // removes "0x"
  });

  return {
    addresses,
    values,
    data,
    dataSizes,
    titles,
  };
};
