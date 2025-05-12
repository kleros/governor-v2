import { lists } from "@/consts/mockLists";

import Paper from "@/assets/svgs/icons/paper.svg";

import ListCard from "./ListCard";

const ActiveLists: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 items-start">
      <div className="flex gap-2 items-center">
        <Paper className="size-4" />
        <h2 className="text-base text-klerosUIComponentsPrimaryText">Active Lists</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {lists.map((list) => (
          <ListCard key={list.id} {...list} />
        ))}
      </div>
    </div>
  );
};

export default ActiveLists;
