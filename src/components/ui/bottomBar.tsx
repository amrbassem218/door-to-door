"use client";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  useEffect(() => {
    setActiveTab("home");
    tabs.forEach((tab) => {
      if (location.pathname.includes(tab)) {
        setActiveTab(tab);
      }
    });
  }, [location.pathname]);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    router.push(`/${tab}`);
  };
  return (
    <div className="sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 border-1 shadow-sm">
      <div className="flex justify-around w-full text-[1.75rem]">
        {/* Home */}
        <div
          className={`flex flex-col items-center ${
            activeTab == "home" ? "text-primary/80" : "text-muted"
          }`}
          onClick={() => handleTabClick("home")}
        >
          <FaHome />
          <p className="text-xs">Home</p>
        </div>

        {/* Categories */}
        <div
          className={`flex flex-col items-center  ${
            activeTab == "categories" ? "text-primary/80" : "text-muted"
          }`}
          onClick={() => handleTabClick("categories")}
        >
          <BiCategory />
          <p className="text-xs">Categories</p>
        </div>

        {/* Cart */}
        <div
          className={`flex flex-col items-center  ${
            activeTab == "cart" ? "text-primary/80" : "text-muted"
          }`}
          onClick={() => handleTabClick("cart")}
        >
          <LuShoppingCart />
          <p className="text-xs">Cart</p>
        </div>

        {/* Account */}
        <div
          className={`flex flex-col items-center  ${
            activeTab == "account" ? "text-primary/80" : "text-muted"
          }`}
          onClick={() => handleTabClick("account")}
        >
          <LuUser />
          <p className="text-xs">Account</p>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
