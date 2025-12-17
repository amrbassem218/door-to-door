"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";

import { useSearch } from "@/contexts/searchContext";
import { useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";
import { Button } from "./button";
import { Input } from "./input";
interface ISearchBarProps {
  styles?: string;
  isFocused?: boolean;
  setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FunctionComponent<ISearchBarProps> = ({
  styles,
  isFocused,
  setIsFocused,
}) => {
  const search = useSearch();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggested, setIsSuggested] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const handleFilter = () => {};
  useEffect(() => {
    if (isSuggested) {
      setSuggestions([]);
    } else if (query && search) {
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
    if (suggestionQuery) {
      setQuery(suggestionQuery);
      setIsSuggested(true);
    } else {
      setIsSuggested(false);
    }
    setSuggestions([]);
    searchBarRef.current?.blur();
    router.push(`/search?query=${suggestionQuery ? suggestionQuery : query}`);
  };
  return (
    <div
      ref={searchRef}
      className={`justify-center relative h-10 bg-background-secondary w-120 max-w-full flex items-center gap-1 rounded-sm ${styles}`}
    >
      {/* <IoSearchOutline className="text-primary absolute left-2" size={18} /> */}
      <button
        className="absolute left-0 w-16 h-full flex items-center justify-between bg-background-muted rounded-l-sm text-text text-sm px-3 text-muted-foreground font-medium"
        type="button"
      >
        All
        <FaAngleDown className="ml-1 text-muted-foreground w-2 h-2" />
      </button>
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
          className="w-full border-0 px-18 h-full text-text"
          value={query}
          onFocus={() => setIsFocused && setIsFocused(true)}
          onBlur={() => setIsFocused && setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          ref={searchBarRef}
        />
      </form>
      <button
        className="cursor-pointer absolute right-0 w-12 h-full flex items-center justify-center bg-primary rounded-r-md text-text"
        onClick={() => handleFilter()}
      >
        <IoSearch className="w-6 h-6 text-background" />
      </button>
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
