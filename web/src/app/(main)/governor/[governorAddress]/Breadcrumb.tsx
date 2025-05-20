"use client";
import { Breadcrumb as _Breadcrumb } from "@kleros/ui-components-library";
import { useRouter } from "next/navigation";

import HomeIcon from "@/assets/svgs/icons/home.svg";

const Breadcrumb: React.FC<{ name: string }> = ({ name }) => {
  const router = useRouter();

  return (
    <_Breadcrumb
      className="[&_small]:text-sm [&_small]:font-normal"
      items={[
        { text: <HomeIcon className="size-3" />, value: "/" },
        { text: name, value: "" },
      ]}
      clickable
      callback={() => {
        router.push("/");
      }}
    />
  );
};

export default Breadcrumb;
