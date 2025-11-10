import { supabase } from "@/supabase/supabaseClient";
import type { Product } from "@/types/types";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import Item from "./item";

interface IAppProps {
  product: Product;
}

const SimialrProducts: React.FunctionComponent<IAppProps> = ({ product }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>();

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
        setSimilarProducts(prods);
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
              <Link href={`/product/${item.id}`}>
                <div className="lg:col-span-2 col-span-6">
                  <Item item={item} />
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default SimialrProducts;
