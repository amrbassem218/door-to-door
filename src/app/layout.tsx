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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
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
