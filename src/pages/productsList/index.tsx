import React, { useState, useEffect } from 'react';
import { useSearch } from '@/searchContext';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProductFilters, Product } from '@/types/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { newPrice } from '@/utilities';
import { getProfile } from '@/userContext';
import { useCurrencyRates } from '@/getRates';

const ProductsList: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  // const [searchQuery, setSearchQuery]
  const search = useSearch();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState(userProfile?.userProfile?.currencies.countryCode ?? "USD");
  const { rates, loading } = useCurrencyRates();
  if (loading) return <p>Loading prices...</p>;
  
  return (
    <div className="container mx-auto py-4 px-2">
      <div className="mb-6">
        <h1 className="text-xl font-bold">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-gray-600">
          Found {filteredProducts.length} products
        </p>
      </div>

      <div className='grid grid-cols-16 gap-10'>
        {/* Filters */}
        <div className="md:block md:col-span-3 hidden mb-6 p-4 border-2 bg-background-secondary-3 border-background-secondary-3 rounded-lg max-w-200 ">
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
                    minOrder: Number(e.target.value)
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
        <div className="grid grid-cols-12 gap-6 md:col-span-13 col-span-16 max-w-screen">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-2 md:gap-0 w-full px-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer col-span-12" onClick={() => navigate(`/product/${product.id}`)}>
              <div className='w-30 h-30  '>
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="object-contain h-full max-w-full mx-auto"
                />
              </div>
              <div className="mid:p-4 flex-1">
                <h3 className="md:font-semibold md:text-lg text-sm mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center gap-2 md:justify-between mb-2">
                  <span className="md:text-xl text-lg font-bold text-green-600">
                    ${newPrice(product, userCurrency, rates)}
                  </span>
                  {product.discount && (
                    <span className="text-sm text-gray-500 line-through">
                      ${Math.round(product.price)}
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
                {product.stockCount !== undefined && (
                  <p className="text-sm text-red-500 font-medium mb-2">
                    {product.stockCount <= 0 && 'Out of stock'}
                  </p>
                )}
                {product.seller && (
                  <p className="text-sm text-gray-500 hidden md:block">by {product.seller}</p>
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
