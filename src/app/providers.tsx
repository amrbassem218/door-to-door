"use client";
import { defaultCurrency } from "@/components/currency/utils";
import {
  UserAuthProfileContext,
  type UserAuthProfile,
} from "@/contexts/authContext";
import { UserCartContext } from "@/contexts/cartContext";
import { UserCurrencyContext } from "@/contexts/currencyContext";
import { UserLangContext, type UserLanguage } from "@/contexts/langContext";
import { UserLocationContext } from "@/contexts/locationContext";
import { getCart } from "@/utils/cart-utils";
import { useUser } from "@/utils/getUser";
import { getProducts, indexProducts } from "@/utils/products-utils";
import { getSuggestion } from "@/utils/search-utils";
import type { Index } from "flexsearch";
import * as React from "react";
import { useEffect, useState } from "react";
import { SearchContext } from "../contexts/searchContext";
import { supabase } from "../supabase/supabaseClient";
import {
  type Cart,
  type Currencies,
  type dbData,
  type FullLocation,
  type Product,
  type ProductFilters,
  type SearchContextType,
  type UserProfile,
} from "../types/types";
import { camel } from "../utilities";
interface IProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FunctionComponent<IProvidersProps> = ({ children }) => {
  const [indexes, setIndexes] = useState<Index<string>[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [userLocation, setUserLocation] = useState<FullLocation | null>(null);
  const [userCurrency, setUserCurrency] = useState<Currencies>(defaultCurrency);
  const [userAuthProfile, setUserAuthProfile] =
    useState<UserAuthProfile | null>(null);
  const [userLang, setUserLang] = useState<UserLanguage | null>(null);
  const [userCart, setUserCart] = useState<Cart | null>(null);
  const user = useUser();
  const handleGetUserData = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*, currencies(*)")
          .eq("id", user.id)
          .single();
        if (error) {
          console.log("couldn't get userData");
          console.error(error);
        } else {
          // Defining userData
          const userProfile = camel(data) as UserProfile;

          // User location
          // TODO: FIX THE LOCATION
          //
          // const geoLocation = userProfile.location as pos;
          // const textualLocation = await reverseGeo(geoLocation);
          // if (textualLocation) {
          //   const fullLocation: FullLocation = {
          //     ...geoLocation,
          //     ...textualLocation,
          //   };
          //   setUserLocation(fullLocation);
          // }

          // Currencies
          const currency = userProfile.currencies;
          setUserCurrency(currency);

          // UserAuth
          const authProfile = {
            username: userProfile.username,
            fullName: userProfile.fullName,
            id: userProfile.id,
          };
          setUserAuthProfile(authProfile);
        }

        // Cart
        const userCart = await getCart(user);
        if (userCart) {
          setUserCart({ ...userCart, length: userCart.length });
        } else {
          console.log("couldn't get usercart");
        }
      } catch (error) {
        console.log("couldn't find userdata");
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (user) {
      handleGetUserData();
    }
  }, [user]);
  useEffect(() => {
    getProducts()
      .then((data: dbData) => {
        if (data) {
          const typedData = data as Product[];
          setProducts(typedData);
          setAllProducts(typedData);
          indexProducts(data).then((props) => {
            setIndexes(props);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);
  const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query || !indexes.length || !products.length) return [];

    return await getSuggestion({
      query,
      products,
      nameIndex: indexes[0],
      tagIndex: indexes[1],
    });
  };

  const filterProducts = (filters: ProductFilters): Product[] => {
    let filtered = [...allProducts];

    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.tags?.includes(filters.category!) ||
          product.name.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (product) =>
          Math.round(product.priceBefore) >= filters.priceRange!.min &&
          Math.round(product.priceBefore) <= filters.priceRange!.max
      );
    }

    if (filters.rating) {
      filtered = filtered.filter((product) => {
        let rating = 0;
        // if(filters.rating == "3 & lower") product.rating && product.rating <= 3;
        if (filters.rating == "5.0") rating = 5;
        else if (filters.rating == "4.5 & above") rating = 4.5;
        else if (filters.rating == "4.0 & above") rating = 4;
        else if (filters.rating == "4.0 & above") rating = 4;
        else if (filters.rating == "3 & above") rating = 3;
        return product.rating && product.rating >= rating;
      });
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter((product) =>
        filters.inStock ? product.stockCount && product.stockCount > 0 : true
      );
    }

    if (filters.seller) {
      filtered = filtered.filter((product) => {
        let flag = false;
        filters.seller?.forEach((seller) => {
          if (product.seller?.toLowerCase().includes(seller!.toLowerCase())) {
            flag = true;
          }
        });
        if (flag) return product;
      });
    }
    if (filters.minOrder) {
      filtered = filtered.filter(
        (prod) =>
          prod.minOrder && filters.minOrder && prod.minOrder <= filters.minOrder
      );
    }
    return filtered;
  };

  const searchContextValue: SearchContextType = {
    indexes,
    products,
    allProducts,
    searchProducts,
    filterProducts,
  };

  return (
    <UserCurrencyContext.Provider value={[userCurrency, setUserCurrency]}>
      <UserLocationContext.Provider value={[userLocation, setUserLocation]}>
        <UserAuthProfileContext.Provider
          value={[userAuthProfile, setUserAuthProfile]}
        >
          <UserLangContext value={[userLang, setUserLang]}>
            <UserCartContext value={[userCart, setUserCart]}>
              <SearchContext.Provider value={searchContextValue}>
                <div className="w-screen">{children}</div>
              </SearchContext.Provider>
            </UserCartContext>
          </UserLangContext>
        </UserAuthProfileContext.Provider>
      </UserLocationContext.Provider>
    </UserCurrencyContext.Provider>
  );
};

export default Providers;
