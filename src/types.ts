import { Index } from "flexsearch";

export interface Item{
    title: string;
    price: number;
    priceBefore: number;
    id: string;
    images: string[]
    thumbnail: string;
    rating?: number;
    reviewCount?: number;
    stock_count?: number;
    description?: string;
    seller?: string;
    sellerId?: string;
    min_order?: number;
    tags?: string[] | string;
}

export type dbData = any[] | null;

export interface SearchContextType {
    indexes: Index<string>[];
    products: Item[];
    allProducts: Item[];
    searchProducts: (query: string) => Promise<Item[]>;
    filterProducts: (filters: ProductFilters) => Item[];
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
    min_order?: number;
    previouslySuppliedTo?:  string[],
    trusted?: boolean;
    freeReturns?: boolean;
}

export interface Product{
  id: number;
  name: string;
  price: number;
  
};

export interface CartItem{
  quantity: number;
  products: Product;
};
