"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserCurrencyCode } from "@/contexts/currencyContext";
import { useSearch } from "@/contexts/searchContext";
import { useCurrencyRates } from "@/getRates";
import type { Product, ProductFilters } from "@/types/types";
import { newPrice } from "@/utilities";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/ui/searchBar";
import { FaAngleDown } from "react-icons/fa6";
import Item from "@/components/ui/item";

interface ISearchPageProps {}

type Sort = "best" | "orders" | "priceAsc" | "priceDesc";

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b pb-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-2 text-base font-semibold"
      >
        {title}
        <FaAngleDown
          className={`text-sm transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="space-y-2 pt-1">{children}</div>}
    </div>
  );
};

function SearchContext() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const search = useSearch();
  const [results, setResults] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [sort, setSort] = useState<Sort>("best");

  const ratingOptions = ["5.0", "4.5 & above", "4.0 & above", "3 & above"];

  useEffect(() => {
    if (searchQuery) {
      search.searchProducts(searchQuery).then(setResults);
    } else {
      setResults(search.allProducts);
    }
  }, [searchQuery, search]);

  useEffect(() => {
    if (query) setSearchQuery(query);
  }, [query]);

  const userCurrencyCode = useUserCurrencyCode();
  const { rates, loading } = useCurrencyRates();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    let list = results;
    if (Object.keys(filters).length > 0) {
      const allowed = new Set(search.filterProducts(filters).map((p) => p.id));
      list = list.filter((p) => allowed.has(p.id));
    }
    const sorted = [...list];
    if (sort === "orders")
      sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    if (sort === "priceAsc" || sort === "priceDesc") {
      const val = (p: Product) => Number(newPrice(p, userCurrencyCode, rates)) || 0;
      sorted.sort((a, b) => (sort === "priceAsc" ? val(a) - val(b) : val(b) - val(a)));
    }
    return sorted;
  }, [results, filters, sort, search, rates, userCurrencyCode]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  if (loading) return <p className="p-6">Loading prices...</p>;

  const sortButtons: { key: Sort; label: string }[] = [
    { key: "best", label: "Best Match" },
    { key: "orders", label: "Orders" },
    { key: sort === "priceAsc" ? "priceDesc" : "priceAsc", label: "Price" },
  ];

  return (
    <div className="mx-auto max-w-[1800px] px-4 md:px-6 2xl:px-10 py-4">
      <div className="sm:hidden mb-4">
        <SearchBar />
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        {/* Filters */}
        <aside className="hidden md:block space-y-4">
          <FilterSection title="Availability">
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <Checkbox
                checked={!!filters.inStock}
                onCheckedChange={(c) =>
                  handleFilterChange({ inStock: c ? true : undefined })
                }
              />
              In stock only
            </label>
          </FilterSection>

          <FilterSection title="Quality & trust">
            {ratingOptions.map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={filters.rating === rating}
                  onCheckedChange={() =>
                    handleFilterChange({
                      rating: filters.rating === rating ? undefined : rating,
                    })
                  }
                />
                <span className="text-primary">★</span> {rating}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Price range">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border rounded-md text-sm"
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: {
                      min: Number(e.target.value) || 0,
                      max: filters.priceRange?.max || 999999,
                    },
                  })
                }
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border rounded-md text-sm"
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: {
                      min: filters.priceRange?.min || 0,
                      max: Number(e.target.value) || 999999,
                    },
                  })
                }
              />
            </div>
          </FilterSection>

          <FilterSection title="Min. order">
            <input
              type="number"
              placeholder="Min. Order"
              className="w-full px-3 py-2 border rounded-md text-sm"
              onChange={(e) =>
                handleFilterChange({ minOrder: Number(e.target.value) })
              }
            />
          </FilterSection>
        </aside>

        {/* Results */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} results
                {searchQuery && (
                  <>
                    {" "}for <span className="font-semibold text-foreground">“{searchQuery}”</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
              <div className="flex overflow-hidden rounded-md border">
                {sortButtons.map(({ key, label }) => {
                  const active =
                    (label === "Price" && sort.startsWith("price")) || sort === key;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSort(key)}
                      className={`px-4 py-2 font-medium border-r last:border-0 transition-colors ${
                        active
                          ? "bg-foreground text-background"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {label}
                      {label === "Price" && sort === "priceAsc" && " ↑"}
                      {label === "Price" && sort === "priceDesc" && " ↓"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-sm bg-red-500 text-white text-center text-sm font-semibold py-2.5">
            Big Sale · Free delivery on local orders
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-6">
              {filteredProducts.map((product) => (
                <Item key={product.id} item={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const SearchPage: React.FunctionComponent<ISearchPageProps> = (props) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <SearchContext />
    </Suspense>
  );
};

export default SearchPage;
