import { createContext, useContext } from "react";
import { Index } from "flexsearch";
import type { LangContextType } from "./types";
import { getSuggestion } from "./utilities";

export const LangContext = createContext<LangContextType | null>(null);

export const useSearch = () => {
    const context = useContext(LangContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
