import Header from "@/components/header/Header";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../App.css";
import "../index.css";
import Providers from "./providers";
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
          <div className="flex flex-col min-h-screen w-full">
            <Header />
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
