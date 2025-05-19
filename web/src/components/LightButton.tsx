"use client";
import React from "react";

import { Button } from "@kleros/ui-components-library";

import { cn } from "@/utils";

const LightButton: React.FC<React.ComponentProps<typeof Button>> = ({ className, ...props }) => (
  <Button
    variant="primary"
    small
    {...props}
    className={cn(
      "hover-short-transition bg-transparent p-2 !rounded-[7px]",
      "hover:bg-whiteLowOpacityStrong",
      "[&>svg]:fill-white/75 hover:[&>svg]:fill-white [&>svg]:mr-0",
      className
    )}
  />
);

export default LightButton;
