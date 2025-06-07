import React, { createContext, useContext, ReactNode, useMemo, useCallback } from "react";

import { Address } from "viem";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { ListStatus } from "@/components/Status";

import { isUndefined } from "@/utils";

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
  const [listsArr, setListsArr] = useLocalStorage<[string, List][]>(`${governorAddress}-lists`, []);
  const lists = useMemo(() => new Map(listsArr), [listsArr]);

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
    }),
    [lists, createNewList, governorAddress, addTxnToList, updateTransactions, updateList, deleteList]
  );

  return <ListsContext.Provider value={contextValue}>{children}</ListsContext.Provider>;
};
