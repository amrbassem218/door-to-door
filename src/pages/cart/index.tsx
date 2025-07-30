import type { CartItems } from '@/types';
import { getCartItems, useUser } from '@/utilities';
import type { User } from '@supabase/supabase-js';
import * as React from 'react';
import { useState, useEffect } from 'react';
interface ICartProps {
}

const Cart: React.FunctionComponent<ICartProps> = (props) => {
  const user = useUser();
  const [cartItems, setCartItems] = useState<CartItems | null>();
  useEffect(() => {
    if(user){
      const handleGetCartItems = async() => {
        getCartItems(user).then((data) => {
          setCartItems(data);
          console.log("cartItems", data);
        }).catch((error) => {
          console.error(error)
        });
      }
      handleGetCartItems();
    }
  }, [user])
  // console.log(cartItems);
  return (
    <div>
      {cartItems && cartItems.products.map((product) => (
        <p>{product.name}</p>
      ))}
    </div>
  );
};

export default Cart;
