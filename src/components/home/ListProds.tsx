"use client";
import Item from "@/components/ui/item";
import type { Product } from "@/types/types";
import { getProducts } from "@/utils/products-utils";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface IListProdProps {
  limit?: number;
  size: string;
}

const Skeleton = ({ size }: { size: string }) => (
  <div className={`flex flex-wrap justify-center gap-4 w-full`}>
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className={`animate-pulse rounded bg-gray-200 ${
          size === "large" ? "w-48 h-64" : "w-40 h-52"
        }`}
      />
    ))}
  </div>
);

const ListProd: React.FunctionComponent<IListProdProps> = ({ limit, size }) => {
  const [items, setItems] = useState<Product[]>();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const getProd = async () => {
      const prod = await getProducts();
      if (prod) {
        setItems(prod);
      }
    };
    getProd();
  }, [isVisible]);

  return (
    <div ref={ref}>
      {!isVisible ? (
        <Skeleton size={size} />
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 min-w-0 w-full">
          {items &&
            items.map((item, i) => {
              return (
                (!limit || (limit && i < limit)) && (
                  <Item key={`${item.name}-${i}`} item={item} />
                )
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ListProd;
