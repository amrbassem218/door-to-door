"use client";
import { useCurrencyRates } from "@/getRates";
import type { Product } from "@/types/types";
import { newPrice, price } from "@/utilities";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useState } from "react";
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
  const [onHover, setOnHover] = useState(false);
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
      className={`${col} transform-all duration-200 ease-in-out hover:scale-101 cursor-pointer ${style} w-full aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden relative flex flex-col`}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      {/* Item Image */}
      <div className="flex-1 min-h-0 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          loading="lazy"
          src={item.thumbnail}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Item Description + Rating */}
      <div className="bg-background p-2 space-y-1">
        <div className="flex items-center gap-1">
          <div className="w-fit p-1 rounded-xs h-4 bg-info flex items-center justify-center shrink-0">
            <span className="text-xs text-primary-foreground">Superdeal</span>
          </div>
          <h1 className="text-sm truncate">{item.name}</h1>
        </div>

        <div className="flex gap-1 items-center">
          <p className="font-semibold text-[1.2rem] leading-none">
            <span className="text-sm font-medium">{userCurrencyCode}</span>
            {computedNewPrice}
          </p>
          <p className="line-through decoration-1 text-muted-foreground text-xs">
            {userCurrencyCode}
            {computedPrice}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Rating
            readonly
            initialValue={item.rating}
            size={12}
            SVGstyle={{ display: "inline-flex" }}
            allowFraction
            fillColor=" oklch(0.56 0.14 35)"
          />
          <p className="text-xs font-medium">{item.rating.toFixed(1)}</p>
          <p className="text-xs font-normal text-gray-600">
            ({item?.reviewCount ?? 0})
          </p>
        </div>

        <div className="flex items-center gap-1 text-destructive">
          <FaLevelDownAlt className="scale-x-[-1]" />
          <p className="text-xs font-medium">EGP100 off on a EGP800 order</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
