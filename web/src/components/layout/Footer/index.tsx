import React from "react";

import clsx from "clsx";
import Link from "next/link";

import LightButton from "@/components/LightButton";

import SecuredByKlerosLogo from "@/assets/svgs/footer/secured-by-kleros.svg";
import DiscordLogo from "@/assets/svgs/socialmedia/discord.svg";
import GithubLogo from "@/assets/svgs/socialmedia/github.svg";
import LinkedinLogo from "@/assets/svgs/socialmedia/linkedin.svg";
import TelegramLogo from "@/assets/svgs/socialmedia/telegram.svg";
import XLogo from "@/assets/svgs/socialmedia/x.svg";
import YouTubeLogo from "@/assets/svgs/socialmedia/youtube.svg";

const socialmedia = {
  telegram: {
    icon: TelegramLogo,
    url: "https://t.me/kleros",
  },
  x: {
    icon: XLogo,
    url: "https://x.com/kleros_io",
  },
  discord: {
    icon: DiscordLogo,
    url: "https://discord.com/invite/MhXQGCyHd9",
  },
  youtube: {
    icon: YouTubeLogo,
    url: "https://youtube.com/@kleros_io",
  },
  github: {
    icon: GithubLogo,
    url: "https://github.com/kleros",
  },
  linkedin: {
    icon: LinkedinLogo,
    url: "https://www.linkedin.com/company/kleros/",
  },
};

const SecuredByKleros: React.FC = () => (
  <Link className="hover:underline" href="https://kleros.io" target="_blank" rel="noreferrer">
    <SecuredByKlerosLogo
      className={clsx("hover=short-transition min-h-6", "[&_path]:fill-white/75 hover:[&_path]:fill-white")}
    />
  </Link>
);

const SocialMedia = () => (
  <div className="flex">
    {Object.values(socialmedia).map(({ url, icon: Icon }) => (
      <Link key={url} href={url} target="_blank" rel="noreferrer">
        <LightButton icon={<Icon />} text="" className="[&_svg]:mr-0" />
      </Link>
    ))}
  </div>
);

const Footer: React.FC = () => (
  <div
    className={clsx(
      "bg-klerosUIComponentsLightBlue",
      "h-16 w-full",
      "flex justify-between shrink-0 items-center gap-4 px-8"
    )}
  >
    <SecuredByKleros />
    <SocialMedia />
  </div>
);

export default Footer;
