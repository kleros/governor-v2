import type { Metadata } from "next";

import { Open_Sans } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import Web3Provider from "@/context/Web3Provider";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

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
    <html lang="en" className={`${openSans.className} antialiased dark box-border size-full`}>
      <body className="bg-klerosUIComponentsLightBackground size-full flex flex-col scrollbar">
        <Web3Provider cookies={cookies}>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
