"use client";
import Link from "next/link";
import * as React from "react";
import Sign from "../sign/sign";
import SearchBar from "../ui/searchBar";
import CartHeader from "./cartHeader";
import ChangeInfo from "./changeInfo";
import GoBackButton from "./goBackButton";
import LocationChange from "./LocationChange";
import Menu from "../home/menu";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <>
      {isFocused && (
        <div
          className={`inset-0  ${
            isFocused ? "fixed bg-black/40" : "bg-transparent"
          } z-50 transition-all ease-in-out`}
          onClick={() => {
            setIsFocused(false);
          }}
        />
      )}
      <div className="top-0 left-0 w-full z-80 bg-background">
        <div className=" w-full  text-accent">
          <div className="px-8 mx-auto ">
            <div className="flex items-center justify-between w-full py-3 gap-8">
              {/* Left Side */}
              <div className="flex items-center gap-6">
                {/* Mobile: Hamburger menu */}
                <div className="flex items-center md:hidden">
                  <Menu />
                </div>

                {/* Back button (desktop only - mobile uses hamburger) */}
                <div className="hidden md:flex">
                  <GoBackButton />
                </div>

                {/* LOGO */}
                <Link
                  className="cursor-pointer font-bold lg:text-3xl text-xl tracking-wide"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                  href={"/"}
                >
                  EGEEX
                </Link>

                {/* Location (desktop only) */}
                <div className="hidden md:block">
                  <LocationChange />
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 hidden sm:inline ">
                <SearchBar styles="w-full" setIsFocused={setIsFocused} />
              </div>

              {/*  Right Side */}
              <div className="flex gap-6 items-center">
                {/* Language & currency (desktop only) */}
                <ChangeInfo />

                {/* Sign */}
                <div className="flex gap-1 items-center">
                  <Sign />
                </div>

                {/* Returns & Orders (desktop only) */}
                <button className="hidden sm:block">
                  <p className="text-sm font-light text-muted-foreground">
                    Returns
                    <br />
                    <span className="font-bold text-sm text-text">& Orders</span>
                  </p>
                </button>

                {/* Cart */}
                <CartHeader />
              </div>
            </div>
          </div>
          {/* <Separator className='w-full'/> */}
          {/* <div className={`hidden sm:block `}>
          <TopicBar />
        </div> */}


        </div>
      </div>
    </>
  );
};

export default Header;
