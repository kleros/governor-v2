"use client";
import { Button } from "@kleros/ui-components-library";

import { useLists } from "@/context/ListsContext";

import Paper from "@/assets/svgs/icons/paper.svg";

const Header: React.FC = () => {
  const { createNewList } = useLists();
  return (
    <div className="flex items-center justify-between w-full">
      <div className=" flex gap-2 items-center ">
        <Paper className="size-4 [&_path]:fill-klerosUIComponentsPrimaryBlue" />
        <h2 className="text-base text-klerosUIComponentsPrimaryText">My Lists</h2>
      </div>
      <Button text="New List" small onPress={createNewList} />
    </div>
  );
};
export default Header;
