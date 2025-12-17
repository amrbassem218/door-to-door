"use client";
import Link from "next/link";
import * as React from "react";
import Sign from "../sign/sign";
import SearchBar from "../ui/searchBar";
import CartHeader from "./cartHeader";
import ChangeInfo from "./changeInfo";
import GoBackButton from "./goBackButton";
import LocationChange from "./LocationChange";

interface IHeaderProps {
  showSearch?: boolean;
}

const Header: React.FunctionComponent<IHeaderProps> = ({ showSearch }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <>
    {
      isFocused &&
      <div
        className={`inset-0  ${isFocused ? "fixed bg-black/40" : "bg-transparent"} z-50 transition-all ease-in-out`}
        onClick={() => {
          setIsFocused(false);
        }}
      />

    }
      <div className="top-0 left-0 w-full z-80 bg-background">
        <div className=" w-full  text-accent">
          <div className="px-8 mx-auto ">
            <div className="flex items-center justify-between w-full py-3 gap-8">
              {/* Left Side */}
              <div className="flex items-center gap-6">
                {/* Back button and menu for phones */}
                <div className="flex items-center md:hidden">
                  <GoBackButton />
                  {/* TODO: Return the menu for phones */}
                  {/* <Menu /> */}
                </div>

                {/* LOGO */}
                <Link
                  className="cursor-pointer font-semibold lg:text-3xl text-lg"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                  href={"/"}
                >
                  EGEEX
                </Link>
                <LocationChange />
              </div>

              {/* Search Bar */}
              <div className="flex-1 hidden sm:inline ">
                <SearchBar styles="w-full" isFocused={isFocused} setIsFocused={setIsFocused} />
              </div>

              {/*  Right Side */}
              <div className="flex gap-6 ">
                {/* Language & currency */}
                <ChangeInfo />

                {/* Sign */}
                <div className="flex gap-1 items-center ">
                  <Sign />
                </div>

                <button>
                  <p className="text-sm font-light text-muted-foreground">
                    Returns
                  </p>
                  <p className="font-semibold text-sm">& Orders</p>
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

          {/* Mobile stuff */}
          <div className="sm:hidden ">
            {/* Mobile Search */}
            <div className="mx-10 my-2">
              {showSearch && <SearchBar styles="" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
