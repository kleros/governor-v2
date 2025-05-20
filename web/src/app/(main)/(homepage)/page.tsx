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
      <div className="size-full px-8 md:px-20 lg:px-33 py-10.5 items-center flex flex-col">
        <div className="max-w-360 flex flex-col w-full gap-6 ">
          <h1 className="text-klerosUIComponentsPrimaryText w-full font-semibold text-2xl">Governors</h1>
          <div className="grid w-full place-content-center grid-cols-[repeat(auto-fit,minmax(300px,382px))] gap-4">
            {governors.map((governor, i) => (
              <GovernorCard {...governor} key={`${governor.name}-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
