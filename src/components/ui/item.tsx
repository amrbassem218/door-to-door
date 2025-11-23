"use client";
import { useCurrencyRates } from "@/getRates";
import type { Product } from "@/types/types";
import { getProfile } from "@/userContext";
import { newPrice, price, save } from "@/utilities";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useState } from "react";
interface IItemProps {
  item: Product;
  col?: string;
  style?: string;
}

const Item: React.FunctionComponent<IItemProps> = ({ item, col, style }) => {
  const { rates, loading } = useCurrencyRates();
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState(
    userProfile?.userProfile?.currencies.currencyCode ?? "USD"
  );
  const router = useRouter();
  const {computedPrice, computedNewPrice} = React.useMemo(() => {
    return {computedNewPrice: newPrice(item, userCurrency, rates), computedPrice: price(item, userCurrency, rates)};
  }, [item, userCurrency, rates]);
  if (loading) return <p>Loading prices...</p>;
  return (
    <div
      onClick={() => router.push(`/product/${item.id}`)}
      className={`${col} border-1 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer bg-background ${style} px-2 w-40`}
    >
      {/* Item Image */}
      <div className="h-24 rounded-t-lg flex items-center justify-center overflow-hidden ">
        <img
          loading="lazy"
          src={item.thumbnail}
          alt=""
          className=" object-contain h-full max-w-full"
        />
      </div>
      {/* <Separator className=''/> */}
      {/* Item Description */}
      <div className="mx-2 mt-2 pb-2 border-b-2 space-y-1">
        <h1 className="text-lg font-medium">{item.name}</h1>
        <div className="flex gap-2 text-md">
          <p className="font-bold">
            {computedNewPrice}
          </p>
          <p className="line-through decoration-1">
            {computedPrice}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-2 py-2">
        <p className="font-semibold text-green-600">
          Save {save(item, userCurrency, rates)} {userCurrency}
        </p>
      </div>
    </div>
  );
};

export default Item;
