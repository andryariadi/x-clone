import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import LeftBar from "@/components/LeftBar";
import RightBar from "@/components/RightBar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Clone",
  description: "X Clone is a social media application project",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
          {/* Left Bar */}
          <section className="px-2 xsm:px-4 xxl:px-8">
            <LeftBar />
          </section>
          {/* Main Content */}
          <section className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray ">
            {children}
            {modal}
          </section>
          {/* Right Bar */}
          <section className="hidden lg:flex ml-4 md:ml-8 flex-1">
            <RightBar />
          </section>
        </div>
      </body>
    </html>
  );
}
