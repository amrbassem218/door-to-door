"use client";
import { getProfile } from "@/contexts/userContext";
import * as React from "react";
import Flag from "react-world-flags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CurrencyDropDown from "./currencyDropDown";
import { useUserCurrency } from "@/contexts/currencyContext";
import { useUserLang } from "@/contexts/langContext";
interface IChangeInfoProps {}

const ChangeInfo: React.FunctionComponent<IChangeInfoProps> = (props) => {
  const [userCurrency] = useUserCurrency();
  const [userLang] = useUserLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden sm:block">
        <div className="flex items-center gap-2 cursor-pointer">
          {/* flag */}
          <div>
            <Flag code={userCurrency.countryCode} className="w-7 h-7" />
          </div>
          <div className="text-xs">
            <p className="text-muted-foreground">{userLang?.langCode ?? "En"}/</p>
            <p className="">{userCurrency.currencyCode}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-70 bg-background px-5 py-3 space-y-3">
        {/*  Location */}
        <div>
          <h1 className="text-xl font-bold">Ship to</h1>
          {/* <LocationDialog userProfile ={userProfile}/> */}
        </div>

        {/* Currency */}
        <CurrencyDropDown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeInfo;
