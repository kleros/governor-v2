import type { Metadata } from "next";

import { Open_Sans } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import Web3Provider from "@/context/Web3Provider";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kleros Governor",
  description: "Governor arbitrated by Kleros.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" className={`${openSans.className} antialiased`}>
      <body>
        <Web3Provider cookies={cookies}>{children}</Web3Provider>
      </body>
    </html>
  );
}
