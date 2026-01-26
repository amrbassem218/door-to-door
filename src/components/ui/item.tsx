"use client";
import { useCurrencyRates } from "@/getRates";
import type { Product } from "@/types/types";
import { newPrice, price } from "@/utilities";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { FaLevelDownAlt } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";
interface IItemProps {
  item: Product;
  col?: string;
  style?: string;
}

const Item: React.FunctionComponent<IItemProps> = ({ item, col, style }) => {
  const { rates, loading } = useCurrencyRates();
  const userCurrencyCode = useUserCurrencyCode();
  const router = useRouter();
  const { computedPrice, computedNewPrice } = React.useMemo(() => {
    return {
      computedNewPrice: newPrice(item, userCurrencyCode, rates),
      computedPrice: price(item, userCurrencyCode, rates),
    };
  }, [item, userCurrencyCode, rates]);
  if (loading) return <p>Loading prices...</p>;
  return (
    <div
      onClick={() => router.push(`/product/${item.id}`)}
      className={`${col} cursor-pointer ${style} p-2 w-56 space-y-1`}
    >
      {/* Item Image */}
      <div className="h-42 w-full ">
        <img
          loading="lazy"
          src={item.thumbnail}
          alt=""
          className=" h-full w-full object-cover"
        />
      </div>

      {/* Item Description */}
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          {/* TODO: Fix to actual deals */}

          {/* Deal */}
          <div className="w-fit p-1 rounded-xs h-4 bg-info flex items-center justify-center">
            <span className="text-xs text-primary-foreground">Superdeal</span>
          </div>
          <h1 className="text-medium  truncate">{item.name} </h1>
        </div>

        <div className="flex gap-1 text-md flex items-center">
          <p className="font-semibold text-[1.4rem] leading-none">
            <span className="text-sm font-medium">{userCurrencyCode}</span>
            {computedNewPrice}{" "}
          </p>

          <p className="line-through decoration-1 text-muted-foreground text-sm">
            {userCurrencyCode}
            {computedPrice}
          </p>
        </div>
      </div>

      {/* Rating and coupon */}
      <div className="space-y-1">

        {/* Rating*/}
        <div className="flex items-end gap-1 ">
          <Rating
            readonly
            initialValue={item.rating}
            size={16}
            SVGstyle={{ display: "inline-flex" }}
            allowFraction // allows values like 3.5 stars
            fillColor=" oklch(0.56 0.14 35)"
          />
          <p className="text-md font-medium">{item.rating.toFixed(1)}</p>
          <p className="text-sm font-normal text-gray-600">
            ({item?.reviewCount ?? 0})
          </p>
        </div>
        
        {/* Deal */}
        <div className="flex items-center gap-1 text-destructive">
          <FaLevelDownAlt className="scale-x-[-1]" />
          {/* TODO: Replace with actual deal */}
          <p className="text-xs font-medium">EGP100 off on a EGP800 order</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
