import { ListStatus } from "@/components/Status";
const list = {
  id: 0,
  submitter: "0xD37888F19e669874cfcCF519bf267280d70498C7" as `0x${string}`,
  createdOn: "Tuesday, February 18, 2025",
  status: ListStatus.Submitted,
  transactions: [
    {
      name: "Update Governor",
      index: 0,
      to: "0xD37888F19e669874cfcCF519bf267280d70498C7",
      value: 0,
      // eslint-disable-next-line max-len
      data: "0x85c855f3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000032d26d12e980b600000",
      decodedInput: "changeSubcourtJurorFee(_subcourtID:3,_feeForJuror:10000000)",
    },
    {
      name: "Update Metadata",
      index: 1,
      to: "0xD37888F19e669874cfcCF519bf267280d70498C7",
      value: 0.1,
      // eslint-disable-next-line max-len
      data: "0x85c855f3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000032d26d12e980b600000",
      decodedInput: "changeSubcourtJurorFee(_subcourtID:3,_feeForJuror:10000000)",
    },
    {
      name: "Increase submission cost",
      index: 2,
      to: "0xD37888F19e669874cfcCF519bf267280d70498C7",
      value: 1,
      // eslint-disable-next-line max-len
      data: "0x85c855f3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000032d26d12e980b600000",
      decodedInput: "changeSubcourtJurorFee(_subcourtID:3,_feeForJuror:10000000)",
    },
  ],
};

export const lists = Array.from({ length: 3 }, (_, index) => ({ ...list, id: index }));
export type List = typeof list;
