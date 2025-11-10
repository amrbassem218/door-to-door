'use client'
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { LuShoppingCart, LuUser } from "react-icons/lu";
import { useLocation } from "react-router-dom";
interface IBottomBarProps {}

const BottomBar: React.FunctionComponent<IBottomBarProps> = (props) => {
  const [activeTab, setActiveTab] = useState("home");

  const location = useLocation();
  const tabs = ["home", "categories", "cart", "account"];
  useEffect(() => {
    setActiveTab("home");
    tabs.forEach((tab) => {
      if (location.pathname.includes(tab)) {
        setActiveTab(tab);
      }
    });
  }, [location.pathname]);
  return (
    <div className="sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 border-1 shadow-sm">
      <div className="flex justify-around w-full text-[1.75rem]">
        {/* Home */}
        <Link href={"/"}>
          <div
            className={`flex flex-col items-center ${
              activeTab == "home" ? "text-primary/80" : "text-muted"
            }`}
            onClick={() => setActiveTab("home")}
          >
            <FaHome />
            <p className="text-xs">Home</p>
          </div>
        </Link>

        {/* Categories */}
        <Link href={"/categories"}>
          <div
            className={`flex flex-col items-center  ${
              activeTab == "categories" ? "text-primary/80" : "text-muted"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <BiCategory />
            <p className="text-xs">Categories</p>
          </div>
        </Link>

        {/* Cart */}
        <Link href={"/cart"}>
          <div
            className={`flex flex-col items-center  ${
              activeTab == "cart" ? "text-primary/80" : "text-muted"
            }`}
            onClick={() => setActiveTab("cart")}
          >
            <LuShoppingCart />
            <p className="text-xs">Cart</p>
          </div>
        </Link>

        {/* Account */}
        <Link href={"/account"}>
          <div
            className={`flex flex-col items-center  ${
              activeTab == "account" ? "text-primary/80" : "text-muted"
            }`}
            onClick={() => setActiveTab("account")}
          >
            <LuUser />
            <p className="text-xs">Account</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
