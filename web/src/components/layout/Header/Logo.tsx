import React from "react";

import Link from "next/link";

import GovernorLogo from "@/assets/svgs/header/governor.svg";

const Logo: React.FC = () => (
  <div className="flex items-center gap-4">
    <Link href={"/"}>
      <GovernorLogo className=" hover-short-transition max-h-12 hover:brightness-105" />
    </Link>
  </div>
);

export default Logo;
