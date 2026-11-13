"use client";
import type { Product } from "@/types/types";
import { getProducts } from "@/utils/products-utils";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";

// Each tile takes its picture from the first real product carrying `tag`.
const categories = [
  { name: "Carpets", tag: "carpets" },
  { name: "Pottery", tag: "Pottery" },
  { name: "Bathrobes", tag: "bathrob" },
  { name: "Towels", tag: "towels" },
  { name: "Sheet sets", tag: "sheet set" },
  { name: "Fruits", tag: "fruits" },
];

const hasTag = (p: Product, tag: string) =>
  Array.isArray(p.tags) &&
  p.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase());

const CategoryTiles = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((p: Product[] | null) => p && setProducts(p));
  }, []);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
      {categories.map((cat) => {
        const image = products.find(
          (p) => hasTag(p, cat.tag) && p.thumbnail?.startsWith("http"),
        )?.thumbnail;
        return (
          <Link
            key={cat.name}
            href={`/search?query=${encodeURIComponent(cat.tag)}`}
            className="group flex flex-col items-center gap-2 rounded-lg border bg-card p-3 hover:shadow-md hover:border-primary transition-all"
          >
            <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-background-muted overflow-hidden">
              {image ? (
                <img
                  loading="lazy"
                  src={image}
                  alt=""
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="h-full w-full animate-pulse bg-border" />
              )}
            </div>
            <p className="text-xs md:text-sm font-medium text-center leading-tight">
              {cat.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryTiles;
