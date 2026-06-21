"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import dynamic from "next/dynamic";
import "../App.css";

const Hero = dynamic(() => import("@/components/home/hero"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 w-full bg-gray-200 mb-10" />,
});

const ListProd = dynamic(() => import("@/components/home/ListProds"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse w-48 h-64 rounded bg-gray-200" />
      ))}
    </div>
  ),
});

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <div className="">
      <div className="mb-10">
        <Hero />
      </div>

      <div>
        {/* Today's deals */}
        <section className="mb-15 space-y-7 px-2 md:px-20">
          <h1 className="text-center text-3xl font-bold">Today's deals</h1>
          <div className="grid grid-cols-12 gap-5">
            {/* Best sellers */}
            <Card className="md:col-span-4 col-span-12 transition-all text-card-foreground rounded-sm md:py-6 md:gap-6 py-3 gap-2">
              <CardHeader className="md:px-6 px-3 md:gap-1.5 gap-0.5">
                <CardTitle className="mx-auto text-lg md:text-2xl font-semibold">
                  Bestsellers
                </CardTitle>
                <CardDescription className="mx-auto">
                  <div className="px-1 md:px-2 w-fit p-0.5 md:p-1 rounded-sm text-center bg-yellow-300">
                    <p className="text-heading text-xs md:text-sm">Best price & Quality</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="md:px-6 px-3">
                <ListProd limit={2} size="large" />
              </CardContent>
            </Card>

            {/* Big save */}
            <Card className="md:col-span-4 col-span-12 transition-all text-card-foreground md:py-6 md:gap-6 py-3 gap-2">
              <CardHeader className="md:px-6 px-3 md:gap-1.5 gap-0.5">
                <CardTitle className="mx-auto text-lg md:text-2xl font-semibold">
                  Big Save
                </CardTitle>
                <CardDescription className="mx-auto">
                  <div className="px-1 md:px-2 w-fit p-0.5 md:p-1 rounded-md text-center bg-red-300/80">
                    <p className="text-heading text-xs md:text-sm">Up to 50% off</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="md:px-6 px-3">
                <ListProd limit={2} size="large" />
              </CardContent>
            </Card>

            {/* Super deals */}
            <Card className="md:col-span-4 col-span-12 transition-all text-card-foreground md:py-6 md:gap-6 py-3 gap-2">
              <CardHeader className="md:px-6 px-3 md:gap-1.5 gap-0.5">
                <CardTitle className="mx-auto text-lg md:text-2xl font-semibold">
                  SuperDeals
                </CardTitle>
                <CardDescription className="mx-auto">
                  <div className="px-1 md:px-2 w-fit p-0.5 md:p-1 rounded-md text-center bg-red-300">
                    <p className="text-heading text-xs md:text-sm">Up to 75% off</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="md:px-6 px-3">
                <ListProd limit={2} size="large" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* More to love */}
        <section className="space-y-7 w-full px-2 md:px-20">
          <h1 className="text-center text-3xl font-bold ">More to love</h1>
          <ListProd size="small" />
        </section>
      </div>
    </div>
  );
};

export default Home;
