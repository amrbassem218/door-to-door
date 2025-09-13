import { Index } from "flexsearch";
import type { Dispatch, SetStateAction } from "react";
import type { Database } from "./database";
import type { Camelize } from "@/utilities";

export interface Product{
    name: string;
    price: number;
    priceBefore: number;
    id: string;
    images: string[]
    thumbnail: string;
    rating?: number;
    reviewCount?: number;
    stockCount?: number;
    description?: string;
    seller?: string;
    sellerId?: number;
    minOrder?: number;
    tags?: string[] ;
    discount: number;
}

export type dbData = any[] | null;

export interface SearchContextType {
    indexes: Index<string>[];
    products: Product[];
    allProducts: Product[];
    searchProducts: (query: string) => Promise<Product[]>;
    filterProducts: (filters: ProductFilters) => Product[];
}
export interface LangContextType{
    lang: string;
    setLang: Dispatch<SetStateAction<string>>;
}
export interface ProductFilters {
    category?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    rating?: string;
    inStock?: boolean;
    seller?: string[];
    minOrder?: number;
    previouslySuppliedTo?:  string[],
    trusted?: boolean;
    freeReturns?: boolean;
}


export interface CartItems{
  quantity: number;
  products: Product[];
};

export interface CartItem{
    products: Product;
    quantity: number;
    measurement: string;
}

export interface pos {
    lat: number;
    lng: number;
}

type localProfiles = Database['public']['Tables']['profiles']['Row'];
export type profilesRow = Camelize<localProfiles>;

type localCurrencies = Database['public']['Tables']['currencies']['Row'];
export type Currencies = Camelize<localCurrencies>

type localReview = Database['public']['Tables']['reviews']['Row'];
export type ReviewType = Camelize<localReview> & {profiles: profilesRow};

export type UserProfile = profilesRow & {currencies: Currencies};

export interface FullLocation {
    country: string | undefined;
    city: string | undefined;
    adress: string | undefined;
}