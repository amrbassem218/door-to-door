import type { User } from "@supabase/supabase-js";
import type { CartItem, Product } from "../types/types";
import { supabase } from "../supabase/supabaseClient"
import { camel } from "@/utilities";
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

export const addProductToCart = async(user: User, product: Product, quantity: number) =>{
  const cartId = await getOrCreateCart(user);
  
  if(!cartId) {
    console.error("Failed to get or create cart for user");
    return "error";
  }
  
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
      console.error(error);
    }
    return "success";
  }
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

export const manualCleanupAllDuplicateCarts = async() => {
  try {
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