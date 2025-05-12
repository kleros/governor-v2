"use client";
import { Button } from "@kleros/ui-components-library";

import Paper from "@/assets/svgs/icons/paper.svg";

import Lists from "./Lists";

const MyLists: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 pb-64">
      <hr className="w-full border-klerosUIComponentsStroke h-0.25" />
      <div className="flex items-center justify-between w-full">
        <div className=" flex gap-2 items-center ">
          <Paper className="size-4 [&_path]:fill-klerosUIComponentsPrimaryBlue" />
          <h2 className="text-base text-klerosUIComponentsPrimaryText">My Lists</h2>
        </div>
        <Button text="New List" small />
      </div>
      <Lists />
    </div>
  );
};

export default MyLists;
