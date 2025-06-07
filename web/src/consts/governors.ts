import { Address } from "viem";

import { arbitrumSepolia, gnosis, mainnet, type Chain } from "@reown/appkit/networks";

import KlerosLogo from "@/assets/svgs/logos/kleros.svg";
import PohLogo from "@/assets/svgs/logos/poh.svg";
import ETH from "@/assets/svgs/tokens/eth.svg";
import Gnosis from "@/assets/svgs/tokens/gnosis.svg";

export type Governor = {
  name: string;
  address: Address;
  Logo: React.FC<React.SVGProps<SVGElement>>;
  chain: Chain;
  ChainIcon: React.FC<React.SVGProps<SVGElement>>;
  snapshotSlug: string;
};

export const governors: Governor[] = [
  {
    name: "Kleros V1",
    address: "0xfbf8932b9551E44022063721800Bbc80c508EA84",
    Logo: KlerosLogo,
    chain: arbitrumSepolia,
    ChainIcon: ETH,
    snapshotSlug: "kleros",
  },
  {
    name: "Kleros V2",
    address: "0xbe8d95497E53aB41d5A45CC8def90d0e59b49f98",
    Logo: KlerosLogo,
    chain: gnosis,
    ChainIcon: Gnosis,
    snapshotSlug: "kleros",
  },
  {
    name: "Proof of Humanity  V1",
    address: "0xbe8d95497E53aB41d5A45CC8def90d0e59b49f97",
    Logo: PohLogo,
    chain: mainnet,
    ChainIcon: ETH,
    snapshotSlug: "kleros",
  },
];

export const getGovernor = (address: string) => governors.find((governor) => governor.address === address);
