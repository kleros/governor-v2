import React, { createContext, useContext, ReactNode, useMemo, useCallback } from "react";

import { Address } from "viem";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { ListStatus } from "@/components/Status";

export type ListTransaction = {
  name: string;
  id: number;
  to: Address;
  value: string;
  data: string;
  decodedInput?: string;
};

export type List = {
  id: number;
  createdOn: number;
  status: ListStatus;
  transactions: ListTransaction[];
};

interface IListsContext {
  lists: List[];
  // creates a new list draft list.
  createNewList: () => void;
  addTxnToList: (listId: number, transaction: Omit<ListTransaction, "id">) => void;
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
  const [lists, setLists] = useLocalStorage<List[]>(`${governorAddress}-lists`, []);

  const createNewList = useCallback(() => {
    const newList: List = {
      id: lists.length,
      createdOn: Math.floor(Date.now() / 1000),
      status: ListStatus.Draft,
      transactions: [],
    };
    setLists([...lists, newList]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);

  const addTxnToList = useCallback(
    (listId: number, transaction: Omit<ListTransaction, "id">) => {
      if (listId >= lists.length) return;
      const list = lists[listId];
      const txnId = list.transactions.length;

      const newTransactions = [...list.transactions, { id: txnId, ...transaction }];

      const updatedList = [...lists];
      updatedList[listId] = { ...list, transactions: newTransactions };

      setLists([...updatedList]);
    },
    [lists]
  );

  const contextValue: IListsContext = useMemo(
    () => ({ lists, createNewList, governorAddress, addTxnToList }),
    [lists, createNewList, governorAddress, addTxnToList]
  );

  return <ListsContext.Provider value={contextValue}>{children}</ListsContext.Provider>;
};
