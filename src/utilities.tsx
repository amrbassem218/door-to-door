import { supabase } from "./supabase/supabaseClient"
import { Index } from "flexsearch"
import { Document } from "flexsearch"
import type { dbData, Item } from "./types";
import { create, all } from 'mathjs'
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export const getProducts = async() => {
    const {data, error} = await supabase
    .from('products')
    .select();
    if(data){
        console.log(data);
    }  
    else{
        console.error(error);
    }
    return data;
} 

export const indexProducts = async(products: dbData) => {
    const nameIndex:Index<string> = new Index({ tokenize: 'forward', cache: true });
    const tagIndex: Index<string> = new Index({ tokenize: 'forward', cache: true });
    if(products){
        for (const product of products) {
            const tagString = Array.isArray(product.tags)
                ? product.tags.join(' ')
                : product.tags;
            nameIndex.add(product.id, product.title);
            tagIndex.add(product.id, tagString);
        }
    }
    return [nameIndex, tagIndex];
}
export const getSuggestion = async({query, products, nameIndex, tagIndex} : {query: string; products: Item[]; nameIndex: Index<string>; tagIndex: Index<string>;}) => {
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
    .map(([id]) => products.find((p: Item) => p.id === id))
    .filter(Boolean) as Item[];
}

export const unitChange = (value: number, currentUnit: string, targetUnit: string) => {
  const math = create(all);
  
  // Debug logging to see what's being passed
  console.log('unitChange called with:', { value, currentUnit, targetUnit });
  
  targetUnit = targetUnit.toLowerCase();
  currentUnit = currentUnit.toLowerCase();
  if(targetUnit == "ton") targetUnit = "tonne";
  if(currentUnit == "ton") currentUnit = "tonne";
  
  console.log('After normalization:', { currentUnit, targetUnit });
  
  const current = math.unit(value, currentUnit);
  const converted = current.to(targetUnit);
  console.log(current);
  console.log(converted);
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

export const getCartItems = async(user: User) => {
  // const , error} = 
  await supabase
  .from('carts')
  .select('id')
  .eq('user_id', user.id)
  .single()
  .then(async({data: cartId}) => {
    await supabase
    .from('cart_items')
    .select('quantity, products(*)')
    .eq('cart_id', cartId)
    .then(({data: cartItems}) => {
      return cartItems;
    })
  })
  return null;
}