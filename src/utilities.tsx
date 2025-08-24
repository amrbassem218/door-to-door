import { supabase } from "./supabase/supabaseClient"
import { Index } from "flexsearch"
import { Document } from "flexsearch"
import type { CartItem, currenciesDataType, dbData, pos, Product } from "./types/types";
import { create, all, prod } from 'mathjs'
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import camelcaseKeys from 'camelcase-keys';
import { getAllCountries } from "country-currency-map";

export const getProducts = async() => {
    const {data: products, error} = await supabase
    .from('products')
    .select();
    if(products){
        // console.log(products);
    }  
    else{
        console.error(error);
    }
    return camel(products);
} 

export const indexProducts = async(products: dbData) => {
    const nameIndex:Index<string> = new Index({ tokenize: 'forward', cache: true });
    const tagIndex: Index<string> = new Index({ tokenize: 'forward', cache: true });
    if(products){
        for (const product of products) {
            const tagString = Array.isArray(product.tags)
                ? product.tags.join(' ')
                : product.tags;
            nameIndex.add(product.id, product.name);
            tagIndex.add(product.id, tagString);
        }
    }
    return [nameIndex, tagIndex];
}
export const getSuggestion = async({query, products, nameIndex, tagIndex} : {query: string; products: Product[]; nameIndex: Index<string>; tagIndex: Index<string>;}) => {
  if (!query || !products) return [];
  const [nameResults, tagResults] = await Promise.all([
    nameIndex.search(query, { limit: 10 }),
    tagIndex.search(query, { limit: 10 }),
  ]);

  const scored = new Map();
  for (const id of nameResults) {
    scored.set(id, (scored.get(id) || 0) + 2); // weight name more
  }
  for (const id of tagResults) {
    scored.set(id, (scored.get(id) || 0) + 1);
  }

  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => products.find((p: Product) => p.id === id))
    .filter(Boolean) as Product[];
}

export const unitChange = (value: number, currentUnit: string, targetUnit: string) => {
  const math = create(all);
  
  // Debug logging to see what's being passed
  // console.log('unitChange called with:', { value, currentUnit, targetUnit });
  
  targetUnit = targetUnit.toLowerCase();
  currentUnit = currentUnit.toLowerCase();
  if(targetUnit == "ton") targetUnit = "tonne";
  if(currentUnit == "ton") currentUnit = "tonne";
  
  // console.log('After normalization:', { currentUnit, targetUnit });
  
  const current = math.unit(value, currentUnit);
  const converted = current.to(targetUnit);
  // console.log(current);
  // console.log(converted);
  return converted.toNumber().toFixed(2);
}
export const handleGoogleAuth = () => {
  supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
}
export const handleLogout = async() => {
  const { error } = await supabase.auth.signOut();  
  console.log("logged out successfully");
  if(error){
    console.error(error);
  }
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null);
    })

    const {data: listener} = supabase.auth.onAuthStateChange((e, session) => {
      setUser(session?.user ?? null);
    })

    return (() => {
      listener.subscription.unsubscribe();
    })
  }, [])
  return user;
}

export const getDisplayName = (user: User) => {
  const meta = user?.user_metadata ?? {}
  return (
    meta.full_name ||    
    meta.name ||      
    meta.username ||  
    meta.user_name || 
    user?.email ||       
    'Anon'       
  )
}
export const getCartId = async(user: User) =>{
  try {
    // First, try to get an existing cart
    let {data: cartId, error} = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if(error){
      if(error.code == "PGRST116"){
        // No cart exists, try to create one
        // Use upsert to prevent duplicate creation
        let {data: newCart, error: createCartError} = await supabase
          .from('carts')
          .upsert({
            user_id: user.id
          }, {
            onConflict: 'user_id', // This prevents duplicate carts for the same user
            ignoreDuplicates: true
          })
          .select('id')
          .single();
        
        if(createCartError){
          console.error("Error creating cart:", createCartError);
          // If upsert fails, try to get the cart again (it might have been created by another request)
          const {data: retryCart, error: retryError} = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if(retryError) {
            console.error("Failed to get cart after creation attempt:", retryError);
            return null;
          }
          return retryCart?.id;
        }
        else if(newCart){
          return newCart.id;
        }
      }
      else{
        console.error("Error fetching cart:", error);
        return null;
      }
    }
    else if(cartId?.id) {
      return cartId.id;
    }
    
    return null;
  } catch (error) {
    console.error("Unexpected error in getCartId:", error);
    return null;
  }
}
// export const getCartItems = async(user: User) => {
//   try {
//     const cartId = await getCartId(user);
    
//     if (!cartId) {
//       // console.log("No cart ID found");
//       return null;
//     }
    
//     const {data: cartItems, error} = await supabase
//       .from('cart_items')
//       .select('quantity, products(*)')
//       .eq('cart_id', cartId);
    
//     if (error) {
//       console.error("Error fetching cart items:", error);
//       return null;
//     }
    
//     return camel(cartItems) as CartItem[];
//   } catch (error) {
//     console.error("Error in getCartItems:", error);
//     return null;
//   }
// }

export const cleanupDuplicateCarts = async(user: User) => {
  try {
    // Get all carts for the user
    const {data: carts, error} = await supabase
      .from('carts')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    
    if(error) {
      console.error("Error fetching carts for cleanup:", error);
      return null;
    }
    
    if(carts && carts.length > 1) {
      // Keep the oldest cart, delete the rest
      const [oldestCart, ...duplicateCarts] = carts;
      
      // Delete duplicate carts
      for(const duplicateCart of duplicateCarts) {
        // First delete cart items
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', duplicateCart.id);
        
        // Then delete the cart
        await supabase
          .from('carts')
          .delete()
          .eq('id', duplicateCart.id);
      }
      
      console.log(`Cleaned up ${duplicateCarts.length} duplicate carts for user ${user.id}`);
      return oldestCart.id;
    }
    
    return carts?.[0]?.id || null;
  } catch (error) {
    console.error("Error in cleanupDuplicateCarts:", error);
    return null;
  }
}

export const getOrCreateCart = async(user: User) => {
  try {
    // First try to get an existing cart
    let cartId = await getCartId(user);
    
    if(!cartId) {
      // If no cart found, try to clean up any duplicates first
      cartId = await cleanupDuplicateCarts(user);
      
      if(!cartId) {
        // Still no cart, create a new one
        const {data: newCart, error} = await supabase
          .from('carts')
          .insert({
            user_id: user.id
          })
          .select('id')
          .single();
        
        if(error) {
          console.error("Error creating new cart:", error);
          return null;
        }
        
        cartId = newCart?.id;
      }
    }
    
    return cartId;
  } catch (error) {
    console.error("Error in getOrCreateCart:", error);
    return null;
  }
}

export const camel = (element: any) => {
  
  if (Array.isArray(element)) {
    const result = element.map((e: any, index: number) => {
      const camelized = camelcaseKeys(e, { deep: true });
      return camelized;
    });
    return result;
  } else if (typeof element === 'object' && element !== null) {
    const result = camelcaseKeys(element, { deep: true });
    return result;
  }
  return element;
}

export const addProductToCart = async(user: User, product: Product, quantity: number) =>{
  const cartId = await getOrCreateCart(user);
  
  if(!cartId) {
    console.error("Failed to get or create cart for user");
    return "error";
  }
  
  // console.log("id: ", cartId)
  // console.log("product_id: ", Number(product.id))
  const {data, error: getProductError} = await supabase
  .from('cart_items')
  .select('product_id')
  .eq('cart_id', cartId);
  let isFound = false;
  if(data){
    for(let e of data){
      if(e.product_id == product.id){
        isFound = true;
        return "error";
      }
    }
  }
  if(!isFound){
    const {error} = await supabase
    .from('cart_items')
    .insert({
      cart_id: cartId,
      product_id: product.id,
      quantity: quantity
    })
    if(error){
      // console.log("error here");
      console.error(error);
    }
    return "success";
  }
}

export const getProduct = async(id: number) => {
  let {data, error} = await supabase
  .from('products')
  .select('*')
  .eq('id', id)
  .single();
  if(error){
    console.error(error);
    // console.log("couldn't fetch product");
    return null;
  }
  return data;
}
export const getCart = async(user: User) => {
  let cartId = await getOrCreateCart(user);
  
  if(!cartId) {
    console.error("Failed to get or create cart for user");
    return null;
  }
  
  let {data, error} = await supabase
  .from('cart_items')
  .select('measurement, quantity, products(*)')
  .eq('cart_id', cartId)

  if(error){
    console.error(error);
  }
  else if(data){
    let camelData: CartItem[] = camel(data);
    return camelData;
  }
}

export const measurements = [
  "KG",
  "Grams",
  "Ton",
  "Ounces"
]

export const newPrice = (product:Product, userCurrency: string, rates: Record<string, number>) => {
  const newPriceInOriginalCurrency = Math.round(Math.round(product.price) - (Math.round(product.price) * (product.discount/100)));
  const finalPrice = convertPrice(newPriceInOriginalCurrency, userCurrency, rates);
  console.log("price in original: ", newPriceInOriginalCurrency);
  console.log("final_price: ", finalPrice);
  return finalPrice;
}
export const price = (product: Product):number => {
  return Math.round(Math.round(product.price));
}

// Manual cleanup function that can be called from browser console
export const manualCleanupAllDuplicateCarts = async() => {
  try {
    console.log("Starting manual cleanup of all duplicate carts...");
    
    // Get all users with duplicate carts
    const {data: duplicateUsers, error} = await supabase
      .from('carts')
      .select('user_id')
      .select(`
        user_id,
        id,
        created_at
      `);
    
    if(error) {
      console.error("Error fetching carts for cleanup:", error);
      return;
    }
    
    if(!duplicateUsers) {
      console.log("No carts found");
      return;
    }
    
    // Group by user_id to find duplicates
    const userCarts = duplicateUsers.reduce((acc, cart) => {
      if(!acc[cart.user_id]) {
        acc[cart.user_id] = [];
      }
      acc[cart.user_id].push(cart);
      return acc;
    }, {} as Record<string, any[]>);
    
    let totalCleaned = 0;
    
    // Clean up duplicates for each user
    for(const [userId, carts] of Object.entries(userCarts)) {
      if(carts.length > 1) {
        console.log(`User ${userId} has ${carts.length} carts, cleaning up...`);
        
        // Sort by created_at to keep the oldest
        carts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const [oldestCart, ...duplicateCarts] = carts;
        
        // Delete duplicate carts
        for(const duplicateCart of duplicateCarts) {
          // First delete cart items
          await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', duplicateCart.id);
          
          // Then delete the cart
          await supabase
            .from('carts')
            .delete()
            .eq('id', duplicateCart.id);
        }
        
        totalCleaned += duplicateCarts.length;
        console.log(`Cleaned up ${duplicateCarts.length} duplicate carts for user ${userId}`);
      }
    }
    
    console.log(`Manual cleanup complete! Total duplicate carts removed: ${totalCleaned}`);
  } catch (error) {
    console.error("Error in manual cleanup:", error);
  }
}

// Make it available globally for browser console access
if(typeof window !== 'undefined') {
  (window as any).cleanupDuplicateCarts = manualCleanupAllDuplicateCarts;
}

export const capetalize = (text: string) => {
  return text.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

async function getAddressFromLatLng(pos: pos | null): Promise<string | undefined> {
  if(!pos) return;
  const lat = pos.lat;
  const lng = pos.lng;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await res.json();

  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0].formatted_address;
  } else {
    return "Unknown location";
  }
}
export const currencyToPrimaryCountry: Record<string, string> = {
  AED: "AE",
  AFN: "AF",
  ALL: "AL",
  DZD: "DZ",
  ARS: "AR",
  AUD: "AU",
  BDT: "BD",
  BGN: "BG",
  BRL: "BR",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  EGP: "EG",
  EUR: "FR",
  GBP: "GB",
  HKD: "HK",
  INR: "IN",
  JPY: "JP",
  KRW: "KR",
  MXN: "MX",
  NZD: "NZ",
  RUB: "RU",
  SAR: "SA",
  SGD: "SG",
  USD: "US",
  ZAR: "ZA",
};

export function convertPrice(
  priceInEGP: number,
  targetCurrency: string,
  rates: Record<string, number>
) {
  targetCurrency = targetCurrency.toLowerCase();
  console.log("target: ", targetCurrency);
  console.log("exists: ", Object.keys(rates).includes(targetCurrency));
  console.log("what happens: ", rates[targetCurrency])
  if (!rates[targetCurrency]) return null;
  return Number((priceInEGP * rates[targetCurrency]).toFixed(2));
}