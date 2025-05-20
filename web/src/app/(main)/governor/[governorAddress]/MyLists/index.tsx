"use client";
import { Button } from "@kleros/ui-components-library";

import Paper from "@/assets/svgs/icons/paper.svg";

import Lists from "./Lists";

const MyLists: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 pb-35 md:pb-64">
      <hr className="w-full border-klerosUIComponentsStroke max-md:hidden h-0.25" />
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
