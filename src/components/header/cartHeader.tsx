"use client";
import { useUserCart, useUserCartLength } from "@/contexts/cartContext";
import { getProfile } from "@/contexts/userContext";
import { useRouter } from "next/navigation";
import * as React from "react";
import { LuShoppingCart } from "react-icons/lu";

interface ICartHeaderProps {}

const CartHeader: React.FunctionComponent<ICartHeaderProps> = (props) => {
  const router = useRouter();
  const cartLength = useUserCartLength();
  return (
    <div
      className="flex gap-1 items-center cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <LuShoppingCart className="text-2xl lg:text-3xl" />
      <div className="flex-col  justify-center items-center hidden md:flex">
        <div className="w-8  bg-secondary flex items-center justify-center px-2 rounded-md">
          <p className="text-sm font-bold text-secondary-foreground">
            {cartLength}
          </p>
        </div>
        <button className="text-sm font-semibold ">Cart</button>
      </div>
    </div>
  );
};

export default CartHeader;
