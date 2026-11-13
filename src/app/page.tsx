"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import Link from "next/link";
import { LuTruck, LuShieldCheck, LuStore, LuHeadphones } from "react-icons/lu";
import { FaAngleRight } from "react-icons/fa";
import dynamic from "next/dynamic";
import "../App.css";

const Hero = dynamic(() => import("@/components/home/hero"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 w-full bg-gray-200 mb-10" />,
});

import CategoryTiles from "@/components/home/CategoryTiles";

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

const perks = [
  { icon: LuStore, title: "Local brands", text: "Made & sold in Egypt" },
  { icon: LuTruck, title: "Door-to-door delivery", text: "Straight from the seller" },
  { icon: LuShieldCheck, title: "Secure checkout", text: "Your payments are protected" },
  { icon: LuHeadphones, title: "Friendly support", text: "We're here when you need us" },
];

const SectionHeader = ({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
    {href && (
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline whitespace-nowrap"
      >
        See all <FaAngleRight />
      </Link>
    )}
  </div>
);

const DealCard = ({
  title,
  badge,
  badgeClass,
  query,
}: {
  title: string;
  badge: string;
  badgeClass: string;
  query: string;
}) => (
  <Card className="md:col-span-4 col-span-12 rounded-lg shadow-sm hover:shadow-md transition-shadow md:py-6 md:gap-4 py-4 gap-3">
    <CardHeader className="md:px-6 px-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg md:text-xl font-semibold">
          {title}
        </CardTitle>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}
        >
          {badge}
        </span>
      </div>
    </CardHeader>
    <CardContent className="md:px-6 px-4 space-y-3">
      <ListProd limit={2} size="large" />
      <Link
        href={`/search?query=${query}`}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Shop {title.toLowerCase()} <FaAngleRight />
      </Link>
    </CardContent>
  </Card>
);

const coupons = [
  { off: "EGP 400 OFF", min: "orders EGP 2,000+", code: "DOOR400" },
  { off: "EGP 250 OFF", min: "orders EGP 1,200+", code: "DOOR250" },
  { off: "EGP 100 OFF", min: "orders EGP 600+", code: "DOOR100" },
];

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <div className="bg-gray-100">
      <Hero />

      {/* Big sale + coupons */}
      <section className="mx-auto max-w-[1800px] px-4 md:px-6 2xl:px-10 -mt-6 relative z-10">
        <div className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 md:p-6 grid md:grid-cols-[1fr_2fr] gap-4 items-center shadow-lg">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold">Big Sale</h2>
            <p className="text-sm opacity-90">Up to 75% off local favorites</p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="rounded-lg bg-white text-red-600 p-2 md:p-3 text-center"
              >
                <p className="font-extrabold text-sm md:text-xl">{c.off}</p>
                <p className="text-[10px] md:text-xs text-gray-600">{c.min}</p>
                <p className="mt-1 text-[10px] md:text-xs font-semibold border border-dashed border-red-400 rounded px-1">
                  Code: {c.code}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="mx-auto max-w-[1800px] px-4 md:px-6 2xl:px-10 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-xl bg-background p-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="text-2xl text-primary shrink-0" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1800px] space-y-4 py-4 px-4 md:px-6 2xl:px-10">
        {/* Today's deals */}
        <section className="space-y-4 rounded-xl bg-background p-4 md:p-5">
          <SectionHeader
            title="Today's deals"
            subtitle="Limited-time prices on local favorites"
            href="/search?query=deals"
          />
          <ListProd layout="scroll" size="small" limit={12} />
        </section>

        {/* Deal columns */}
        <section className="grid grid-cols-12 gap-4">
          <DealCard
            title="Bestsellers"
            badge="Best price & quality"
            badgeClass="bg-yellow-300 text-black"
            query="bestsellers"
          />
          <DealCard
            title="Big Save"
            badge="Up to 50% off"
            badgeClass="bg-red-300/80 text-black"
            query="sale"
          />
          <DealCard
            title="SuperDeals"
            badge="Up to 75% off"
            badgeClass="bg-red-400 text-white"
            query="deals"
          />
        </section>

        {/* Shop by category */}
        <section className="space-y-4 rounded-xl bg-background p-4 md:p-5">
          <SectionHeader
            title="Shop by category"
            subtitle="Find what you need from local sellers"
            href="/categories"
          />
          <CategoryTiles />
        </section>

        {/* Sell with us banner */}
        <section className="rounded-xl bg-primary text-primary-foreground px-6 md:px-12 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-3xl font-bold">
              Own a local brand? Sell with us.
            </h2>
            <p className="text-sm md:text-base opacity-80">
              Reach customers across Egypt and beyond with Door to Door.
            </p>
          </div>
          <Link
            href="/add_product"
            className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground font-semibold px-6 h-11 hover:opacity-90 transition-opacity w-fit"
          >
            Start selling
          </Link>
        </section>

        {/* More to love */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-center">
            More to love
          </h2>
          <ListProd size="small" />
          <div className="flex justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full border border-primary text-primary font-medium px-8 h-11 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Browse all products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
