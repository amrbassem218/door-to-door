import { supabase } from "./supabase/supabaseClient"
import { Index } from "flexsearch"
import { Document } from "flexsearch"
import type { CartItem, dbData, Product } from "./types";
import { create, all, prod } from 'mathjs'
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import camelcaseKeys from 'camelcase-keys';

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
  supabase.auth.signInWithOAuth({provider: 'google'})

}
export const handleLogout = async() => {
  const { error } = await supabase.auth.signOut();  
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
  let {data: cartId, error} = await supabase
  .from('carts')
  .select('id')
  .eq('user_id', user.id)
  .single();
  // console.log("user:", user)
  if(error){
    if(error.code == "PGRST116"){
      let {data: cartId, error: createCartError} = await supabase
      .from('carts')
      .insert({
        user_id: user.id
      })
      .select('id')
      .single();
      if(createCartError){
        console.error(createCartError);
        // console.log("couldn't create a new cart");
      }
      else if(cartId){
        return cartId.id;
      }
    }
    else{
  // console.log("I'm here");

      console.error(error);
    }
  }
  else if(cartId?.id) return cartId.id;
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
  const cartId = await getCartId(user);
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
  let cartId = await getCartId(user);
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

export const newPrice = (product:Product) => {
  return product.price - (product.price / product.discount);
}