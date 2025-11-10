"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { IoFilter, IoSearchOutline } from "react-icons/io5";

import { Input } from "./input";
import { Button } from "./button";
import { useSearch } from "@/contexts/searchContext";
import { useRouter } from "next/router";
interface ISearchBarProps {
  styles?: string;
}

const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ styles }) => {
  const search = useSearch();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const handleFilter = () => {};
  useEffect(() => {
    if (query && search) {
      search.searchProducts(query).then((results) => {
        setSuggestions(results);
      });
    } else {
      setSuggestions([]);
    }
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (suggestionQuery?: string) => {
    router.push(`/search/${suggestionQuery ? suggestionQuery : query}`);
  };
  return (
    <div
      ref={searchRef}
      className={`justify-center relative h-10 bg-background w-120 max-w-full flex items-center gap-1 rounded-md ${styles}`}
    >
      <IoSearchOutline className="text-primary absolute left-2" size={18} />
      <form
        className="w-full h-full"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit();
        }}
      >
        <Input
          type="text"
          placeholder="Search crops, furniture and more..."
          className="w-full border-0 px-8 h-full text-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <Button
        className="cursor-pointer absolute right-0"
        variant={"link"}
        onClick={() => handleFilter()}
      >
        <IoFilter className="text-primary" />
      </Button>
      {/* Suggestions dropdown */}
      {suggestions.length > 0 && query && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => {
                // setQuery();
                handleSearchSubmit(suggestion.name);
                setSuggestions([]);
              }}
            >
              <div>
                <div className="font-medium text-primary">
                  {suggestion.name}
                </div>
                {suggestion.tags && (
                  <div className="text-sm text-muted">
                    {Array.isArray(suggestion.tags)
                      ? suggestion.tags.join(", ")
                      : suggestion.tags}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
