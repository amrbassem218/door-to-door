'use client'
import * as React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../ui/dropdown-menu";
import Flag from 'react-world-flags'
import { getProfile } from "@/userContext";
import CurrencyDropDown from "./currencyDropDown";
interface IChangeInfoProps {}

const ChangeInfo: React.FunctionComponent<IChangeInfoProps> = (props) => {
  const rawUserProfile = getProfile();
  const userProfile = rawUserProfile?.userProfile;
  const setUserProfile = rawUserProfile?.setUserProfile;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden sm:block">
        <div className="flex items-center gap-2 cursor-pointer">
          {/* flag */}
          <div>
            <Flag code={userProfile?.countryCode ?? "EG"} className="w-7 h-7" />
          </div>
          <div className="text-xs">
            <p className="text-muted-foreground">{userProfile?.language}/</p>
            <p className="">{userProfile?.currency}</p>
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
