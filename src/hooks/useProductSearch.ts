import { useState } from 'react';
import type { Product, ProductFilters } from '@/types/types';
import { useSearch } from '@/contexts/searchContext';

export const useProductSearch = () => {
  const search = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search products by query
  const searchProducts = async(query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    if (query.trim()) {
      const searchResults = await search.searchProducts(query);
      setResults(searchResults);
    } else {
      setResults(search.allProducts);
    }
    
    setIsLoading(false);
  };

  // Filter products by criteria
  const filterProducts = (newFilters: ProductFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    
    const filteredResults = search.filterProducts(newFilters);
    setResults(filteredResults);
    
    setIsLoading(false);
  };

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return search.filterProducts({ category });
  };

  // Get products in price range
  const getProductsInPriceRange = (min: number, max: number) => {
    return search.filterProducts({ priceRange: { min, max } });
  };

  // Get products with minimum rating
  const getProductsByRating = (rating: number) => {
    const strRating = rating.toString();
    return search.filterProducts({ rating: strRating });
  };

  // Get in-stock products
  const getInStockProducts = () => {
    return search.filterProducts({ inStock: true });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setResults(search.allProducts);
  };

  // Get all products
  const getAllProducts = () => {
    return search.allProducts;
  };

  return {
    // State
    searchQuery,
    filters,
    results,
    isLoading,
    
    // Actions
    searchProducts,
    filterProducts,
    getProductsByCategory,
    getProductsInPriceRange,
    getProductsByRating,
    getInStockProducts,
    clearFilters,
    getAllProducts,
    
    // Direct access to search context
    searchContext: search
  };
}; 