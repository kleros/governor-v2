import HeroImageMobile from "@/assets/svgs/hero/header-darkmode-mobile.svg";
import HeroImage from "@/assets/svgs/hero/header-darkmode.svg";

import { governors } from "@/consts/governors";

import GovernorCard from "./GovernorCard";
export default function Home() {
  return (
    <>
      <div>
        <HeroImage className="hidden sm:block" />
        <HeroImageMobile className="sm:hidden" />
      </div>
      <div className="size-full px-33 pt-10.5 items-center flex flex-col">
        <div className="max-w-360 flex flex-col gap-6 ">
          <h1 className="text-klerosUIComponentsPrimaryText font-semibold text-2xl">Governors</h1>
          <div className="flex gap-4 flex-wrap">
            {governors.map((governor, i) => (
              <GovernorCard {...governor} key={`${governor.name}-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
