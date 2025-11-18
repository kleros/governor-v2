import React, { HTMLAttributes } from "react";

import clsx from "clsx";
import Link from "next/link";

import LinkArrow from "@/assets/svgs/icons/link-arrow.svg";

interface IExternalLink {
  text: string;
  url: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}
const ExternalLink: React.FC<IExternalLink> = ({ text, url, className }) => {
  return (
    <Link
      href={url}
      className={clsx("block w-fit text-center hover:brightness-[1.2]", className)}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className="text-center text-primary-blue text-sm items-center">
        <span className="mr-1"> {text} </span>
        <LinkArrow className="inline-block aspect-square size-4" />
      </span>
    </Link>
  );
};
export default ExternalLink;
