"use client";
import Item from "@/components/ui/item";
import type { Product } from "@/types/types";
import { getProducts } from "@/utils/products-utils";
import * as React from "react";
import { useEffect, useState } from "react";
interface IListProdProps {
  limit?: number;
  size: string;
}

const ListProd: React.FunctionComponent<IListProdProps> = ({ limit, size }) => {
  const [items, setItems] = useState<Product[]>();
  useEffect(() => {
    const getProd = async () => {
      const prod = await getProducts();
      if (prod) {
        setItems(prod);
      }
    };
    getProd();
  }, []);
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {items &&
        items.map((item, i) => {
          return (
            (!limit || (limit && i < limit)) && (
              <Item key={`${item.name}-${i}`} item={item} />
            )
          );
        })}
    </div>
  );
};

export default ListProd;
