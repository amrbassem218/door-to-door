import { supabase } from "./supabase/supabaseClient"
import { Index } from "flexsearch"
import { Document } from "flexsearch"
import type { dbData, Item } from "./types";
export const getProducts = async() => {
    const {data, error} = await supabase
    .from('products')
    .select();
    if(data){
        console.log(data);
    }  
    else{
        console.error(error);
    }
    return data;
} 

export const indexProducts = async(products: dbData) => {
    const nameIndex:Index<string> = new Index({ tokenize: 'forward', cache: true });
    const tagIndex: Index<string> = new Index({ tokenize: 'forward', cache: true });
    if(products){
        for (const product of products) {
            const tagString = Array.isArray(product.tags)
                ? product.tags.join(' ')
                : product.tags;
            nameIndex.add(product.id, product.title);
            tagIndex.add(product.id, tagString);
        }
    }
    return [nameIndex, tagIndex];
}
export const getSuggestion = async({query, products, nameIndex, tagIndex} : {query: string; products: Item[]; nameIndex: Index<string>; tagIndex: Index<string>;}) => {
  if (!query || !products) return [];
  const [nameResults, tagResults] = await Promise.all([
    nameIndex.search(query, { limit: 10 }),
    tagIndex.search(query, { limit: 10 }),
  ]);

  const scored = new Map();
  for (const id of nameResults) {
    scored.set(id, (scored.get(id) || 0) + 2); // weight name more
  }
  for (const id of tagResults) {
    scored.set(id, (scored.get(id) || 0) + 1);
  }

  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => products.find((p: Item) => p.id === id))
    .filter(Boolean) as Item[];
}
