import React, { useState } from "react";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

interface IProduct {
  text: string;
  url: string;
  Icon: React.FC<React.SVGAttributes<SVGElement>> | string;
}

const Product: React.FC<IProduct> = ({ text, url, Icon }) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <Link
      href={url}
      target="_blank"
      className={clsx(
        "bg-klerosUIComponentsLightBackground hover:bg-klerosUIComponentsLightGrey w-25 rounded-base cursor-pointer",
        "flex flex-col items-center gap-2",
        "hover:transform-[0.15s] hover:transition-colors duration-[0.3s] hover:scale-[1.02]",
        "pt-4 px-2 pb-7"
      )}
    >
      {typeof Icon === "string" ? (
        <>
          {!isImgLoaded ? <Skeleton width={48} height={46} circle /> : null}
          <Image
            alt={Icon}
            src={Icon}
            width={48}
            height={48}
            className={clsx(isImgLoaded ? "block" : "none")}
            onLoad={() => setIsImgLoaded(true)}
          />
        </>
      ) : (
        <Icon className="size-12" />
      )}
      <small className="font-normal text-sm text-klerosUIComponentsPrimaryText">{text}</small>
    </Link>
  );
};

export default Product;
