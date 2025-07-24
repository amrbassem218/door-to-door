export interface Item{
    title: string;
    price: number;
    priceBefore: number;
    id: string;
    images: string[]
    mainImage: string;
    rating?: number;
    reviewCount?: number;
    stockCount?: number;
    description?: string;
    seller?: string;
    sellerId?: string;
    minQuantity?: number;
}