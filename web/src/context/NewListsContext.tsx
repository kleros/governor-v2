import React, { createContext, useContext, ReactNode, useMemo, useCallback, useState } from "react";

import { Address } from "viem";

import { useAccount, usePublicClient } from "wagmi";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { ListStatus } from "@/components/Status";

import { isUndefined } from "@/utils";

import { DEFAULT_CHAIN } from "@/consts";

export type ListTransaction = {
  name: string;
  id: string;
  to: Address;
  txnValue: string;
  data: string;
  decodedInput?: string;
};

export type List = {
  id: string;
  createdOn: number;
  status: ListStatus;
  transactions: ListTransaction[];
};

interface IListsContext {
  lists: List[];
  // creates a new list draft list.
  createNewList: () => void;
  deleteList: (listId: string) => void;
  addTxnToList: (listId: string, transaction: Omit<ListTransaction, "id">) => void;
  updateTransactions: (listId: string, transaction: ListTransaction[]) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  simulateList: (listId: string) => Promise<{ status: boolean; simulationLink?: string }>;
  isSimulating: boolean;
  governorAddress: Address;
}

const ListsContext = createContext<IListsContext | undefined>(undefined);

export const useLists = () => {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useLists must be used within a ListsProvider");
  }
  return context;
};

type ListsProviderProps = {
  children: ReactNode;
  governorAddress: Address;
};

export const ListsProvider: React.FC<ListsProviderProps> = ({ children, governorAddress }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const { chainId } = useAccount();
  const publicClient = usePublicClient({ chainId: chainId ?? DEFAULT_CHAIN.id });

  const [listsArr, setListsArr] = useLocalStorage<[string, List][]>(`${governorAddress}-lists`, []);
  const lists = useMemo(() => new Map(listsArr), [listsArr]);

  const simulateList = useCallback(
    async (listId: string) => {
      const list = lists.get(listId);

      if (isUndefined(list) || isUndefined(publicClient)) return { status: false, simulationLink: undefined };
      setIsSimulating(true);
      try {
        const simulationResult = await fetch("/api/simulate", {
          method: "POST",
          body: JSON.stringify({
            networkId: DEFAULT_CHAIN.id,
            governorAddress,
            transactions: list.transactions,
          }),
        });

        if (!simulationResult.ok) {
          const errorText = await simulationResult.text();
          throw new Error(`Sharing simulation failed: ${simulationResult.status} ${errorText}`);
        } else {
          return simulationResult.json();
        }
      } catch (error) {
        console.log(error instanceof Error ? error.message : `Simulation Failed`);
        return {
          status: false,
          simulationLink: undefined,
        };
      } finally {
        setIsSimulating(false);
      }
    },

    [lists, governorAddress, publicClient]
  );

  const createNewList = useCallback(() => {
    const id = crypto.randomUUID();

    const newList: List = {
      id,
      createdOn: Math.floor(Date.now() / 1000),
      status: ListStatus.Draft,
      transactions: [],
    };

    lists.set(id, newList);
    setListsArr(Array.from(lists.entries()));
  }, [lists]);

  const deleteList = useCallback(
    (listId: string) => {
      lists.delete(listId);
      setListsArr(Array.from(lists.entries()));
    },
    [lists]
  );

  const addTxnToList = useCallback(
    (listId: string, transaction: Omit<ListTransaction, "id">) => {
      const list = lists.get(listId);
      if (isUndefined(list)) return;

      const txnId = crypto.randomUUID();

      const newTransactions = [...list.transactions, { id: txnId, ...transaction }];

      list.transactions = newTransactions;
      lists.set(listId, list);

      setListsArr(Array.from(lists.entries()));
    },
    [lists]
  );

  const updateTransactions = useCallback(
    (listId: string, transactions: ListTransaction[]) => {
      const list = lists.get(listId);
      if (isUndefined(list)) return;

      list.transactions = transactions;
      lists.set(listId, list);

      setListsArr(Array.from(lists.entries()));
    },
    [lists]
  );

  const updateList = useCallback(
    (listId: string, updates: Partial<List>) => {
      const list = lists.get(listId);
      if (isUndefined(list)) return;

      lists.set(listId, { ...list, ...updates });

      setListsArr(Array.from(lists.entries()));
    },
    [lists]
  );

  const contextValue: IListsContext = useMemo(
    () => ({
      // we want to show the latest on top
      lists: [...lists.values()].toReversed(),
      createNewList,
      governorAddress,
      addTxnToList,
      updateTransactions,
      updateList,
      deleteList,
      simulateList,
      isSimulating,
    }),
    [
      lists,
      createNewList,
      governorAddress,
      addTxnToList,
      updateTransactions,
      updateList,
      deleteList,
      simulateList,
      isSimulating,
    ]
  );

  return <ListsContext.Provider value={contextValue}>{children}</ListsContext.Provider>;
};
