import Header from "@/components/header/Header";
import type { Metadata } from "next";
import "../App.css";
import "../index.css";
import Providers from "./providers";
import { Toaster } from "sonner";
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
          <div>
            {/* <TopBar /> */}
            <Header />
            {children}
          </div>
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
