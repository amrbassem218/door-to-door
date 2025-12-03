"use client";
import MenuItem from "@/components/ui/menuItem";
import { useUser } from "@/utils/getUser";
import { getDisplayName } from "@/utils/user-utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { FaRegHeart } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { RiCoupon2Line } from "react-icons/ri";

interface IAccountProps {}

const Account: React.FunctionComponent<IAccountProps> = (props) => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div className="space-y-5 bg-gray-100">
      {/* Account info */}
      <section className="px-3 space-y-4 bg-background py-3">
        {user ? (
          <div className="flex gap-2 items-center">
            {/* <User size={60}/> */}
            <div className="w-12 h-12">
              <img loading="lazy" src={"/avatar.png"} alt="" />
            </div>
            <p className="font-semibold text-lg">{getDisplayName(user)}</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <img loading="lazy" src="/avatar.png" alt="" />
            <p className="font-semibold text-lg">Sign In / Register</p>
          </div>
        )}
        <div className="flex justify-around">
          {/* Favourites */}
          <div className="flex flex-col items-center gap-2">
            <FaRegHeart className="text-2xl" />
            <p className="text-sm">Favourites</p>
          </div>
          {/* Favourites */}
          <div className="flex flex-col items-center gap-2">
            <RiCoupon2Line className="text-2xl" />
            <p className="text-sm">Coupons</p>
          </div>
          {/* Favourites */}
          <div className="flex flex-col items-center gap-2">
            <LuShoppingCart className="text-2xl" />
            <p className="text-sm">Cart</p>
          </div>
        </div>
      </section>

      {/* Help Menu */}
      <section className="py-4 px-3 space-y-3 bg-background">
        <ul>
          <li>
            <div onClick={() => router.push("/account/settings")}>
              <MenuItem name="Settings" />
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Account;
