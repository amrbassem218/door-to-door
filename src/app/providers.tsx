'use client'
import * as React from 'react';
import { useEffect, useState } from 'react'
import {camel } from '../utilities'
import type { dbData, SearchContextType, Product, ProductFilters, UserProfile } from '../types/types'
import type { Index } from 'flexsearch'
import { SearchContext } from '../contexts/searchContext'
import { UserContext } from '../userContext'
import { supabase } from '../supabase/supabaseClient'
import { getProducts, indexProducts } from '@/utils/products-utils';
import { getSuggestion } from '@/utils/search-utils';
import { useUser } from '@/utils/getUser';
interface IProvidersProps {
  children: React.ReactNode
}

const Providers: React.FunctionComponent<IProvidersProps> = ({children}) => {
  const [indexes, setIndexes] = useState<Index<string>[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [lang, setLang] = useState<string>("en");
  useEffect(() => {
    getProducts()
    .then((data: dbData) => {
      if(data){
        const typedData = data as Product[];
        setProducts(typedData);
        setAllProducts(typedData);
        indexProducts(data).then((props) => {
            setIndexes(props);
        })
      }
    })
    .catch((error:any) => {
      console.error(error);
    })
  }, [])

  const searchProducts = async(query: string): Promise<Product[]> => {
    if (!query || !indexes.length || !products.length) return [];
    
    return await getSuggestion({
      query,
      products,
      nameIndex: indexes[0],
      tagIndex: indexes[1]
    });
  };

  const filterProducts = (filters: ProductFilters): Product[] => {
    let filtered = [...allProducts];

    if (filters.category) {
      filtered = filtered.filter(product => 
        product.tags?.includes(filters.category!) || 
        product.name.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        Math.round(product.price) >= filters.priceRange!.min && 
        Math.round(product.price) <= filters.priceRange!.max
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(product => {
        let rating = 0;
        // if(filters.rating == "3 & lower") product.rating && product.rating <= 3;
        if(filters.rating == "5.0") rating = 5;
        else if(filters.rating == "4.5 & above") rating = 4.5;
        else if(filters.rating == "4.0 & above") rating = 4;
        else if(filters.rating == "4.0 & above") rating = 4;
        else if(filters.rating == "3 & above") rating = 3;
        return product.rating && product.rating >= rating
      }
      );
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product => 
        filters.inStock ? (product.stockCount && product.stockCount > 0) : true
      );
    }

    if (filters.seller) {
      filtered = filtered.filter(product => {
        let flag = false;
        filters.seller?.forEach((seller) => {
          if(product.seller?.toLowerCase().includes(seller!.toLowerCase())){
            flag = true;
          }
        })
        if(flag) return product;
      });
    }
    if(filters.minOrder){
      filtered = filtered.filter((prod) => (
        prod.minOrder && filters.minOrder && prod.minOrder <= filters.minOrder
      ))
    }
    return filtered;
  };

  const searchContextValue: SearchContextType = {
    indexes,
    products,
    allProducts,
    searchProducts,
    filterProducts
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const user = useUser();
  useEffect(() => {
    if(user){
      const getUserData = async() => {
        try {
          const {data: userData, error} = await supabase
          .from('profiles')
          .select('*, currencies(*)')
          .eq('id', user.id)
          .single();
          if(error){
            console.log("couldn't get user profile");
            console.error(error);
          }
          if(userData){
            const camelUser = camel(userData) as UserProfile;
            setUserProfile(camelUser);
          }
        } catch (error) {
          console.error("Network error fetching user profile:", error);
          // Don't crash the app, just log the error
        }
      }
      getUserData();
    }
  }, [user])
    
  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      <SearchContext.Provider value={searchContextValue}>
        <div className='w-screen'>
          {children}
        </div>
      </SearchContext.Provider>
    </UserContext.Provider>
  )
};

export default Providers;
