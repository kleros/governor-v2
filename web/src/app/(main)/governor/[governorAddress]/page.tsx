import { getGovernor } from "@/consts/governors";

import ActiveLists from "./ActiveLists";
import Breadcrumb from "./Breadcrumb";
import GovernorDetailsCard from "./GovernorDetails";
import MyLists from "./MyLists";

export default function Page({ params }: { params: { governorAddress: string } }) {
  const { governorAddress } = params;

  const governor = getGovernor(governorAddress);

  return (
    <div className="size-full max-w-360 mx-33 mt-20 items-center flex flex-col gap-12 self-center">
      <div className="flex flex-col gap-4 items-start w-full">
        <Breadcrumb name={governor?.name ?? ""} />
        <GovernorDetailsCard {...governor!} />
      </div>
      <ActiveLists />
      <MyLists />
    </div>
  );
}
