"use client";
import { useUserCurrency } from "@/contexts/currencyContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { IoIosArrowBack } from "react-icons/io";

interface ISettingsProps {}

const Settings: React.FunctionComponent<ISettingsProps> = (props) => {
  const egypt = { code: "EG", name: "Egypt" };
  const [userCurrency, setUserCurrency] = useUserCurrency();
  const router = useRouter();
  return (
    <div>
      {/* Header */}
      <div className="flex px-2 gap-1 items-center pb-2 pt-3 border-b-1 shadow-sm ">
        <Link href={"/"}>
          <IoIosArrowBack className=" text-xl" />
        </Link>
        <h1 className="text-lg">Settings</h1>
      </div>

      {/* content */}
      <div>
        {/* Profile */}
        <div
          className="border-b-1 px-5 py-3"
          onClick={() => router.push("/account/settings/profile")}
        >
          <p className="font-medium">Profile</p>
        </div>

        {/* Currency */}
        <div
          className="border-b-1 px-5 py-3 flex justify-between"
          onClick={() => router.push("/account/settings/currency")}
        >
          <p className="font-medium">Currency</p>
          <p className="text-muted">{userCurrency?.currencyCode}</p>
        </div>

        {/* Ship to */}
        <div
          className="border-b-1 px-5 py-3"
          onClick={() => router.push("/location")}
        >
          <p className="font-medium">Ship to</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
