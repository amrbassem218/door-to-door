import { supabase } from "@/supabase/supabaseClient";
import type { dbData } from "@/types/types";
import { camel } from "@/utilities";
import { Index } from "flexsearch";

let cachedProducts: any = null;

export const getProducts = async () => {
  if (cachedProducts) return cachedProducts;
  const { data: products, error } = await supabase.from("products").select();
  if (products) {
    cachedProducts = camel(products);
  } else {
    console.error(error);
  }
  return cachedProducts;
};

export const clearProductsCache = () => {
  cachedProducts = null;
};

export const indexProducts = async (products: dbData) => {
  const nameIndex: Index<string> = new Index({
    tokenize: "forward",
    cache: true,
  });
  const tagIndex: Index<string> = new Index({
    tokenize: "forward",
    cache: true,
  });
  if (products) {
    for (const product of products) {
      const tagString = Array.isArray(product.tags)
        ? product.tags.join(" ")
        : product.tags;
      nameIndex.add(product.id, product.name);
      tagIndex.add(product.id, tagString);
    }
  }
  return [nameIndex, tagIndex];
};

export const getProduct = async (id: number) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data;
};
