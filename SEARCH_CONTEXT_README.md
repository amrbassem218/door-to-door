# Enhanced Search Context Documentation

## Overview

The enhanced search context provides a centralized way to manage product data, search functionality, and filtering across your application. It includes:

- **Product Data**: All products loaded from the database
- **Search Indexes**: FlexSearch indexes for fast text search
- **Search Functions**: Methods to search and filter products
- **Type Safety**: Full TypeScript support with proper types

## Types

### SearchContextType
```typescript
interface SearchContextType {
    indexes: Index<string>[];
    products: Item[];
    allProducts: Item[];
    searchProducts: (query: string) => Item[];
    filterProducts: (filters: ProductFilters) => Item[];
}
```

### ProductFilters
```typescript
interface ProductFilters {
    category?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    rating?: number;
    inStock?: boolean;
    seller?: string;
}
```

### Item
```typescript
interface Item {
    title: string;
    price: number;
    priceBefore: number;
    id: string;
    images: string[];
    thumbnail: string;
    rating?: number;
    reviewCount?: number;
    stockCount?: number;
    description?: string;
    seller?: string;
    sellerId?: string;
    minOrder?: number;
}
```

## Usage

### Basic Usage with useSearch Hook

```typescript
import { useSearch } from '@/searchContext';

const MyComponent = () => {
  const search = useSearch();
  
  // Get all products
  const allProducts = search.allProducts;
  
  // Search products
  const results = search.searchProducts("apple");
  
  // Filter products
  const filtered = search.filterProducts({
    priceRange: { min: 10, max: 50 },
    rating: 4,
    inStock: true
  });
  
  return (
    <div>
      <p>Total products: {allProducts.length}</p>
      <p>Search results: {results.length}</p>
      <p>Filtered results: {filtered.length}</p>
    </div>
  );
};
```

### Using the Custom Hook

```typescript
import { useProductSearch } from '@/hooks/useProductSearch';

const ProductList = () => {
  const {
    results,
    isLoading,
    searchProducts,
    filterProducts,
    getProductsByCategory,
    clearFilters
  } = useProductSearch();

  const handleSearch = (query: string) => {
    searchProducts(query);
  };

  const handleFilter = () => {
    filterProducts({
      priceRange: { min: 20, max: 100 },
      rating: 4
    });
  };

  const handleCategoryFilter = (category: string) => {
    const categoryProducts = getProductsByCategory(category);
    // Use categoryProducts...
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => handleSearch("organic")}>Search Organic</button>
      <button onClick={handleFilter}>Apply Filters</button>
      <button onClick={clearFilters}>Clear Filters</button>
      
      {results.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${Math.round(product.price)}</p>
        </div>
      ))}
    </div>
  );
};
```

## Search Functions

### searchProducts(query: string)
Performs a text search using FlexSearch indexes on product titles and tags.

```typescript
const results = search.searchProducts("organic vegetables");
```

### filterProducts(filters: ProductFilters)
Filters products based on various criteria.

```typescript
// Filter by price range
const expensiveProducts = search.filterProducts({
  priceRange: { min: 50, max: 200 }
});

// Filter by rating
const highRatedProducts = search.filterProducts({
  rating: 4
});

// Filter by category
const categoryProducts = search.filterProducts({
  category: "vegetables"
});

// Filter in-stock items
const availableProducts = search.filterProducts({
  inStock: true
});

// Combine multiple filters
const filteredProducts = search.filterProducts({
  priceRange: { min: 10, max: 50 },
  rating: 4,
  category: "fruits",
  inStock: true
});
```

## Example Components

### Search Bar Component
```typescript
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const search = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <button type="submit">Search</button>
    </form>
  );
};
```

### Category Filter Component
```typescript
const CategoryFilter = () => {
  const search = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = search.filterProducts({ category });
    // Update your component state with filtered results
  };

  return (
    <select onChange={(e) => handleCategoryChange(e.target.value)}>
      <option value="">All Categories</option>
      <option value="vegetables">Vegetables</option>
      <option value="fruits">Fruits</option>
      <option value="dairy">Dairy</option>
    </select>
  );
};
```

### Price Range Filter
```typescript
const PriceRangeFilter = () => {
  const search = useSearch();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const applyPriceFilter = () => {
    const filtered = search.filterProducts({
      priceRange: {
        min: Number(minPrice) || 0,
        max: Number(maxPrice) || 999999
      }
    });
    // Update your component state with filtered results
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <button onClick={applyPriceFilter}>Apply</button>
    </div>
  );
};
```

## Best Practices

1. **Always check if context exists**: The `useSearch` hook will throw an error if used outside the SearchContext provider.

2. **Use the custom hook for complex logic**: The `useProductSearch` hook provides additional state management and loading states.

3. **Memoize expensive operations**: For large product lists, consider memoizing search results.

4. **Handle loading states**: Always provide loading indicators when performing searches or filters.

5. **Type safety**: Use the provided TypeScript types for better development experience.

## Error Handling

```typescript
const MyComponent = () => {
  try {
    const search = useSearch();
    // Use search context
  } catch (error) {
    // Handle case where component is used outside SearchContext
    return <div>Search context not available</div>;
  }
};
```

## Performance Considerations

- The search indexes are created once when the app loads
- Search operations are fast due to FlexSearch indexing
- Filter operations are performed on the client-side for immediate results
- Consider pagination for large result sets
- Use React.memo for components that receive search results as props 