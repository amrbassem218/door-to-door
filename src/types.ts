import { Index } from "flexsearch";

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
