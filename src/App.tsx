import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/ui/Header'
import TopBar from './components/ui/topbar'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import Auth from './auth'
import { getProducts, indexProducts, getSuggestion, useUser } from './utilities'
import type { dbData, SearchContextType, Product, ProductFilters, LangContextType, UserProfile } from './types/types'
import type { Index } from 'flexsearch'
import { SearchContext } from './searchContext'
import { LangContext } from './langContext'
import { UserContext } from './userContext'
import { supabase } from './supabase/supabaseClient'
function App() {
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

  const searchProducts = async (query: string): Promise<Product[]> => {
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
      // console.log(filters.inStock)
      // console.log(products[0].stockCount)
      // // console.log(filters.inStock)
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

  const langContextValue: LangContextType = {
    lang,
    setLang  
  }
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const user = useUser();
  useEffect(() => {
    if(user){
      const getUserData = async() => {
        const {data: userData, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        if(error){
          console.log("couldn't get user profile");
          console.error(error);
        }
        if(userData){
          setUserProfile(userData);
        }
      }
      getUserData();
    }
  }, [user])
    
  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      <SearchContext.Provider value={searchContextValue}>
        <div className='w-screen'>
          <RouterProvider router={router}/>
        </div>
      </SearchContext.Provider>
    </UserContext.Provider>
  )
}

export default App
