import { createContext, useContext } from "react";
import { Index } from "flexsearch";
import type { SearchContextType } from "./types";
import { getSuggestion } from "./utilities";

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
