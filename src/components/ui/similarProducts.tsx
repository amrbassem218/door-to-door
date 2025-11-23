"use client";
import { supabase } from "@/supabase/supabaseClient";
import type { Product } from "@/types/types";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import Item from "./item";
import { camel } from "@/utilities";

interface IAppProps {
  product: Product;
}

const SimialrProducts: React.FunctionComponent<IAppProps> = ({ product }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>();
  const router = useRouter();
  useEffect(() => {
    if (product) {
      const getSimilarProds = async () => {
        const productTags = product?.tags ?? [];
        const productsMap = new Map<number, Product>();
        for (const tag of productTags) {
          const { data: similar, error } = await supabase
            .from("products")
            .select("*")
            .contains("tags", [tag]);
          if (error) {
            console.log("couldn't get similar products");
            console.error(error);
          } else if (similar) {
            similar.forEach((prod) => {
              productsMap.set(prod.id, prod);
            });
          }
        }
        const prods = Array.from(productsMap.values());
        setSimilarProducts(camel(prods));
      };
      getSimilarProds();
    }
  }, [product]);
  return (
    <div>
      {/* More to love */}
      <section className="space-y-7 px-2">
        <h1 className="text-center text-3xl font-bold ">More to love</h1>
        <div className="grid grid-cols-12 gap-5">
          {similarProducts &&
            similarProducts.map((item, i) => (
              <div key={`${item.name}-${i}`} className="lg:col-span-2 col-span-6" onClick={() => router.push(`/product/${item.id}`)}>
                <Item item={item} />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default SimialrProducts;
