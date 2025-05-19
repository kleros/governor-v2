"use client";
import clsx from "clsx";
import { useToggle } from "react-use";

import DappList from "./navbar/DappList";
import Help from "./navbar/Menu/Help";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Header: React.FC = () => {
  const [isDappListOpen, toggleIsDappListOpen] = useToggle(false);
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);

  return (
    <div className={clsx("bg-klerosUIComponentsLightBlue backdrop-blur-md", "flex wrap sticky z-30 top-0 w-full px-6")}>
      <DesktopNavbar {...{ toggleIsDappListOpen, toggleIsHelpOpen }} />
      <MobileNavbar {...{ toggleIsDappListOpen, toggleIsHelpOpen }} />

      <Help {...{ toggleIsHelpOpen, isOpen: isHelpOpen }} />
      <DappList {...{ toggleIsDappListOpen, isOpen: isDappListOpen }} />
    </div>
  );
};

export default Header;
