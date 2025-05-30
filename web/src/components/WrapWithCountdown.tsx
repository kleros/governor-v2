"use client";
import Countdown from "react-countdown";

interface IWrapWithCountdown extends React.ComponentProps<typeof Countdown> {
  // a custom text with $$$ as placeholder to insert countdown at.
  text?: string;
}

const WrapWithCountdown: React.FC<IWrapWithCountdown> = ({ children, text, ...props }) => {
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return children ? children : <></>;
    } else {
      let prefix: string | null;
      let suffix: string | null;
      if (text) {
        [prefix, suffix] = text.split("$$$", 2);
      } else {
        prefix = null;
        suffix = null;
      }
      return (
        <span className="text-klerosUIComponentsSecondaryText text-sm">
          {prefix} {hours ? `${hours}h` : null} {minutes ? `${minutes}m` : null} {seconds}s {suffix}
        </span>
      );
    }
  };

  return <Countdown {...props} {...{ renderer }} />;
};

export default WrapWithCountdown;
