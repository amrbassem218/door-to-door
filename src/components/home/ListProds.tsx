"use client";
import Item from "@/components/ui/item";
import type { Product } from "@/types/types";
import { getProducts } from "@/utils/products-utils";
import { filterLoadable } from "@/utils/image-utils";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface IListProdProps {
  limit?: number;
  size: string;
  /** "scroll" renders a horizontal AliExpress-style rail. */
  layout?: "grid" | "scroll";
  offset?: number;
}

const Skeleton = ({ size }: { size: string }) => (
  <div className={`flex flex-wrap justify-center gap-4 w-full`}>
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className={`animate-pulse rounded bg-border ${
          size === "large" ? "w-48 h-64" : "w-40 h-52"
        }`}
      />
    ))}
  </div>
);

const ListProd: React.FunctionComponent<IListProdProps> = ({ limit, size, layout = "grid", offset = 0 }) => {
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
        // Hide products whose picture fails to load.
        setItems(await filterLoadable(prod));
      }
    };
    getProd();
  }, [isVisible]);

  return (
    <div ref={ref}>
      {!isVisible || !items ? (
        <Skeleton size={size} />
      ) : (
        <div
          className={`${
            layout === "scroll"
              ? "flex gap-3 overflow-x-auto snap-x pb-2 [&>*]:w-40 md:[&>*]:w-48 [&>*]:shrink-0 [&>*]:snap-start"
              : size === "large"
                ? "grid grid-cols-2 gap-3"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          } min-w-0 w-full`}
        >
          {items
            .slice(offset, limit ? offset + limit : undefined)
            .map((item, i) => (
              <Item key={`${item.id ?? item.name}-${i}`} item={item} />
            ))}
        </div>
      )}
    </div>
  );
};

export default ListProd;
