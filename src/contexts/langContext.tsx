import { createContext, useContext } from "react";
import type { LangContextType } from "../../types/types";

export const LangContext = createContext<LangContextType | null>(null);

export const useSearch = () => {
    const context = useContext(LangContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
