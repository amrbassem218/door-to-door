import * as React from "react";
import { Button } from "../ui/button";
import TopicBar from "../ui/topicBar";
import { useLocation } from "react-router-dom";
import Sign from "../sign";
import SearchBar from "../ui/searchBar";
import { Check, ChevronsUpDown } from "lucide-react";
import { countries } from "../countries";
// import { Separator } from './separator';r
import { cn } from "@/lib/utils";
import { getCart, useUser, cleanupDuplicateCarts } from "@/utilities";
import { LuShoppingCart } from "react-icons/lu";
import MobileTopicBar from "../ui/mobileTopicBar";
import Menu from "../home/menu";
import { getProfile } from "@/userContext";
import GoBackButton from "./goBackButton";
import CurrencyDropDown from "./currencyDropDown";
import ChangeInfo from "./changeInfo";
import Link from "next/link";
import CartHeader from "./cart";

interface IHeaderProps {
  showSearch?: boolean;
}

const Header: React.FunctionComponent<IHeaderProps> = ({ showSearch }) => {
  const location = useLocation();
  // ${
  //         location.pathname == "/" && "sm:absolute"
  //       }
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-primary text-primary-foreground z-50 `}
    >
      {/* <TopBar/> */}
      <div className=" w-full ">
        <div className="sm:px-20 px-2 mx-auto">
          <div className="flex items-center justify-between w-full lg:h-20 lg:gap-15 h-12 ">
            {/* Logo & Menu */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <GoBackButton />
                <Menu />
              </div>
              <Link
                className="cursor-pointer font-semibold lg:text-3xl text-lg"
                href={"/"}
              >
                EGEEX
              </Link>
            </div>

            <div className="flex-1 hidden sm:inline">
              {showSearch && <SearchBar styles="w-full" />}
            </div>

            <div className="flex gap-5">
              {/* Language & currency */}
              <ChangeInfo />
              {/* Sign */}
              <div className="flex gap-1 items-center ">
                <Sign />
              </div>

              {/* Cart */}
              <CartHeader />
            </div>
          </div>
        </div>
        {/* <Separator className='w-full'/> */}
        <div
          className={`hidden sm:block ${
            location.pathname != "/" && "sm:hidden"
          }`}
        >
          <TopicBar />
        </div>

        {/* Mobile stuff */}
        <div className="sm:hidden ">
          {/* Mobile Search */}
          <div className="mx-10 my-2">
            {showSearch && <SearchBar styles="" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
