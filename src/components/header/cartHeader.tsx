'use client'
import { getProfile } from "@/userContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { LuShoppingCart } from "react-icons/lu";

interface ICartHeaderProps {}

const CartHeader: React.FunctionComponent<ICartHeaderProps> = (props) => {
  const userProfile = getProfile();
  const router = useRouter();
  return (
    <div className="flex gap-1 items-center cursor-pointer" onClick={() => router.push("/cart")}>
      <LuShoppingCart className="text-2xl lg:text-3xl" />
      <div className="flex-col  justify-center items-center hidden md:flex">
        <div className="w-10 h-3 bg-secondary flex items-center justify-center p-2 rounded-md">
          <p className="text-sm font-bold text-secondary-foreground">
            {userProfile?.userProfile?.cart?.cartLength ?? 0}
          </p>
        </div>
        <button className="text-sm font-semibold ">Cart</button>
      </div>
    </div>
  );
};

export default CartHeader;