import type { Metadata } from "next";
import Providers from "./providers";
import TopBar from "@/components/ui/topbar";
import Header from "@/components/header/Header";

export const metadata: Metadata = {
  title: "EGEEX",
  description: "The first global egyptian market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopBar />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
