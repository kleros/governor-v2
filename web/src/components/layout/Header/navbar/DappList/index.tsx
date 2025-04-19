"use client";
import React from "react";

import { Modal } from "@kleros/ui-components-library";
import clsx from "clsx";

import Curate from "@/assets/svgs/icons/curate.svg";
import Resolver from "@/assets/svgs/icons/dispute-resolver.svg";
import Escrow from "@/assets/svgs/icons/escrow.svg";
import Governor from "@/assets/svgs/icons/governor.svg";
import Court from "@/assets/svgs/icons/kleros.svg";
import POH from "@/assets/svgs/icons/poh.svg";
import Vea from "@/assets/svgs/icons/vea.svg";

import Product from "./Product";

const ITEMS = [
  {
    text: "Court V2",
    Icon: Court,
    url: "https://v2.kleros.builders/",
  },
  {
    text: "Curate V2",
    Icon: Curate,
    url: "https://curate-v2.netlify.app/",
  },
  {
    text: "Resolver V2",
    Icon: Resolver,
    url: "https://v2.kleros.builders/#/resolver",
  },
  {
    text: "Escrow V2",
    Icon: Escrow,
    url: "https://escrow-v2.kleros.builders/",
  },
  {
    text: "Court V1",
    Icon: Court,
    url: "https://court.kleros.io/",
  },
  {
    text: "Curate V1",
    Icon: Curate,
    url: "https://curate.kleros.io",
  },
  {
    text: "Resolver V1",
    Icon: Resolver,
    url: "https://resolve.kleros.io",
  },
  {
    text: "Escrow V1",
    Icon: Escrow,
    url: "https://escrow.kleros.io",
  },
  {
    text: "Vea",
    Icon: Vea,
    url: "https://veascan.io",
  },
  {
    text: "Kleros Scout",
    Icon: Curate,
    url: "https://klerosscout.eth.limo",
  },
  {
    text: "POH V2",
    Icon: POH,
    url: "https://v2.proofofhumanity.id",
  },
  {
    text: "Governor",
    Icon: Governor,
    url: "https://governor.kleros.io",
  },
];

interface IDappList {
  isOpen?: boolean;
  toggleIsDappListOpen: () => void;
}

const DappList: React.FC<IDappList> = ({ isOpen, toggleIsDappListOpen }) => {
  return (
    <Modal
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground shadow-default",
        "absolute  max-w-120",
        "flex flex-col items-center",
        "z-1 rounded-base border border-klerosUIComponentsStroke",
        "mt-18 top-0 left-0 right-auto transform-none w-75 lg:w-120 h-auto md:max-h-[80vh]",
        "animate-slide-in-right"
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsDappListOpen}
      isDismissable
    >
      <h1 className="py-6 text-2xl font-semibold text-klerosUIComponentsPrimaryText">Kleros Solutions</h1>
      <div
        className={clsx(
          "grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] items-center gap-x-0.5 gap-y-2",
          "max-w-120 min-w-75 w-75 lg:w-120",
          "overflow-y-auto pt-1 pb-4 px-4 lg:px-6 "
        )}
      >
        {ITEMS.map((item) => {
          return <Product {...item} key={item.text} />;
        })}
      </div>
    </Modal>
  );
};
export default DappList;
