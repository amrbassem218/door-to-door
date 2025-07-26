import React, { useState, useEffect } from 'react';
import { useSearch } from '@/searchContext';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductFilters, Item } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const ProductsList: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  // const [searchQuery, setSearchQuery]
  const search = useSearch();
  const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  // Option Arrays
  const ratingOptions = ["5.0", "4.5 & above", "4.0 & above", "3 & above"];

  
  useEffect(() => {
    if (searchQuery) {
      search.searchProducts(searchQuery).then(results => {
        setFilteredProducts(results);
      });
    } else {
      setFilteredProducts(search.allProducts);
    }
  }, [searchQuery, search]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const filtered = search.filterProducts(filters);
      setFilteredProducts(filtered);
    }
  }, [filters, search]);

  useEffect(() => {
    if(query){
      setSearchQuery(query);  
    }
  }, [query])

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-gray-600">
          Found {filteredProducts.length} products
        </p>
      </div>

      <div className='grid grid-cols-16 gap-10'>
        {/* Filters */}
        <div className="mb-6 p-4 border-2 bg-background-secondary-3 border-background-secondary-3 rounded-lg max-w-200 col-span-3">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="flex flex-col gap-4">

            {/* In Stock */}
            <div>
              <h2 className="text-md font-medium">In Stock</h2>
              <div className='flex gap-3 items-center'>
                <Checkbox id={`In Stock Only`} onCheckedChange={() => handleFilterChange({
                  inStock: filters.inStock ? !filters.inStock : true
                })}/>
                <label htmlFor={`In Stock Only`}>In Stock Only</label>
              </div>
            </div>
            
            {/* Rating */}
            <div className=''>
              <div className='mb-2'>
                <h2 className='text-md font-medium'>Rating</h2>
                <p className='text-sm text-text'>
                  Based on a 5-star rating system 
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                {
                  ratingOptions.map((rating) => (
                    <div className='flex gap-3 items-center'>
                      <Checkbox id={`${rating}`} onCheckedChange={() => handleFilterChange({
                        rating: filters.rating == rating ? undefined : rating
                      }) }/>
                      <label htmlFor={`${rating}`}>{rating}</label>
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <h2 className="text-md font-medium">Price Range</h2>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => handleFilterChange({
                    priceRange: {
                      min: Number(e.target.value) || 0,
                      max: filters.priceRange?.max || 999999
                    }
                  })}
                />
                <p className='text-lg text-text'>-</p>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => handleFilterChange({
                    priceRange: {
                      min: filters.priceRange?.min || 0,
                      max: Number(e.target.value) || 999999
                    }
                  })}
                />

              </div>
            </div>

            {/* Min order */}
            <div>
              <div>
                <h2 className="text-md font-medium">Min. Order</h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min. Order"
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => handleFilterChange({
                    min_order: Number(e.target.value)
                  })}
                />
              </div>
            </div>

            {/* Category */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                placeholder="Search category"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => handleFilterChange({ category: e.target.value })}
              />
            </div> */}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 col-span-13">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
              <div className='h-48 my-2'>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="object-contain h-full max-w-full mx-auto"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  {product.priceBefore && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.priceBefore}
                    </span>
                  )}
                </div>
                {product.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm">{product.rating}</span>
                    {product.reviewCount && (
                      <span className="ml-1 text-sm text-gray-500">
                        ({product.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}
                {product.stock_count !== undefined && (
                  <p className="text-sm text-gray-600 mb-2">
                    {product.stock_count > 0 ? `${product.stock_count} in stock` : 'Out of stock'}
                  </p>
                )}
                {product.seller && (
                  <p className="text-sm text-gray-500">by {product.seller}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductsList;
