"use client";

import { Address } from "viem";

import { ListsProvider } from "@/context/LIstsContext";

import Header from "./Header";
import Lists from "./Lists";

const MyLists: React.FC<{ governor: Address }> = ({ governor }) => {
  return (
    <ListsProvider governorAddress={governor}>
      <div className="w-full flex flex-col gap-4 md:gap-6 pb-35 md:pb-64">
        <hr className="w-full border-klerosUIComponentsStroke max-md:hidden h-0.25" />
        <Header />
        <Lists />
      </div>
    </ListsProvider>
  );
};

export default MyLists;
