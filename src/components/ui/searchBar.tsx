"use client";
import { Command as CommandPrimitive } from "cmdk";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";

import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useSearch } from "@/contexts/searchContext";
import { cn } from "@/lib/utils";

interface ISearchBarProps {
  styles?: string;
  setIsFocused?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_SUGGESTIONS = 8;

const SearchBar: React.FunctionComponent<ISearchBarProps> = ({
  styles,
  setIsFocused,
}) => {
  const search = useSearch();
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Fetch suggestions (ignoring out-of-order responses).
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    search.searchProducts(q).then((results) => {
      if (!cancelled) setSuggestions((results ?? []).slice(0, MAX_SUGGESTIONS));
    });
    return () => {
      cancelled = true;
    };
  }, [query, search]);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setQuery(q);
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/search?query=${encodeURIComponent(q)}`);
  };

  const showList = open && query.trim().length > 0;

  return (
    <Popover open={showList} onOpenChange={setOpen}>
      <CommandPrimitive
        shouldFilter={false}
        loop
        className={cn("h-10 w-120 max-w-full", styles)}
      >
        <PopoverAnchor asChild>
          <div
            ref={anchorRef}
            className="relative h-full w-full bg-background-secondary flex items-center rounded-sm"
          >
            <button
              className="absolute left-0 h-full flex items-center bg-background-muted rounded-l-sm text-xs sm:text-sm px-2 text-muted-foreground font-medium"
              type="button"
              tabIndex={-1}
            >
              All
              <FaAngleDown className="ml-1 w-2 h-2 sm:w-3" />
            </button>
            <CommandPrimitive.Input
              ref={inputRef}
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                setOpen(true);
              }}
              onFocus={() => {
                setOpen(true);
                setIsFocused?.(true);
              }}
              onBlur={() => setIsFocused?.(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Search crops, furniture and more..."
              className="w-full h-full bg-transparent outline-none px-14 text-sm placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label="Search"
              onClick={() => submit(query)}
              className="cursor-pointer absolute right-0 w-10 h-full flex items-center justify-center bg-primary rounded-r-md"
            >
              <IoSearch className="w-3 h-3 md:w-4 md:h-4 text-background" />
            </button>
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="p-0 w-(--radix-popover-trigger-width)"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // Clicking the input itself is not "outside".
            if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
          }}
        >
          <CommandPrimitive.List className="max-h-72 overflow-y-auto p-1">
            {/* First row so Enter searches the raw text */}
            <CommandPrimitive.Item
              value={`__query__${query}`}
              onSelect={() => submit(query)}
              className="flex items-center gap-2 relative rounded-sm pl-4 pr-3 py-2 data-[selected=true]:bg-primary/10 data-[selected=true]:before:absolute data-[selected=true]:before:left-0 data-[selected=true]:before:top-0 data-[selected=true]:before:h-full data-[selected=true]:before:w-1 data-[selected=true]:before:bg-primary data-[selected=true]:before:rounded-l-sm text-sm cursor-pointer"
            >
              <IoSearch className="shrink-0 text-muted-foreground" />
              <span className="truncate">
                Search for <strong>“{query.trim()}”</strong>
              </span>
            </CommandPrimitive.Item>
            {suggestions.map((s, i) => (
              <CommandPrimitive.Item
                key={s.id ?? i}
                value={`${s.id ?? i}-${s.name}`}
                onSelect={() => submit(s.name)}
                className="flex items-center gap-3 relative rounded-sm pl-4 pr-3 py-2 data-[selected=true]:bg-primary/10 data-[selected=true]:before:absolute data-[selected=true]:before:left-0 data-[selected=true]:before:top-0 data-[selected=true]:before:h-full data-[selected=true]:before:w-1 data-[selected=true]:before:bg-primary data-[selected=true]:before:rounded-l-sm cursor-pointer"
              >
                {s.thumbnail && (
                  <img
                    src={s.thumbnail}
                    alt=""
                    className="h-8 w-8 rounded object-cover shrink-0 bg-background-muted"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  {Array.isArray(s.tags) && s.tags.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {s.tags.join(", ")}
                    </p>
                  )}
                </div>
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>
        </PopoverContent>
      </CommandPrimitive>
    </Popover>
  );
};

export default SearchBar;
