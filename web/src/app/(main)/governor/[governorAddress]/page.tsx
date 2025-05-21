import { notFound } from "next/navigation";

import { getGovernor, governors } from "@/consts/governors";

import ActiveLists from "./ActiveLists";
import Breadcrumb from "./Breadcrumb";
import GovernorDetailsCard from "./GovernorDetails";
import MyLists from "./MyLists";

export async function generateStaticParams() {
  return governors.map((governor) => ({
    governorAddress: governor.address,
  }));
}

export default function Page({ params }: { params: { governorAddress: string } }) {
  const { governorAddress } = params;

  const governor = getGovernor(governorAddress);

  if (!governor) {
    notFound();
  }

  return (
    <div className="size-full flex justify-center px-6 md:px-20 lg:px-33 py-20 box-border">
      <div className="max-w-360 w-full items-center flex flex-col gap-8 md:gap-12 box-border">
        <div className="flex flex-col gap-4 items-start w-full">
          <Breadcrumb name={governor.name} />
          <GovernorDetailsCard {...governor} />
        </div>
        <ActiveLists />
        <MyLists />
      </div>
    </div>
  );
}
