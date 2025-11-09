import type { Product } from "@/types/types";
import type { Index } from "flexsearch";

export const getSuggestion = async ({
  query,
  products,
  nameIndex,
  tagIndex,
}: {
  query: string;
  products: Product[];
  nameIndex: Index<string>;
  tagIndex: Index<string>;
}) => {
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
    .map(([id]) => products.find((p: Product) => p.id === id))
    .filter(Boolean) as Product[];
};
