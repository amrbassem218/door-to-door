"use client";
import type { Product } from "@/types/types";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
export interface UserCart {
  id: number;
  length: number | null;
  products: Product[];
}
export type UserCartState = [UserCart, Dispatch<SetStateAction<UserCart>>];
export const UserCartContext = createContext<UserCartState | null>(null);

export const useUserCart = () => {
  const userCartState = useContext(UserCartContext);
  if (!userCartState) {
    throw new Error("user Auth was not found");
  }
  return userCartState;
};

export const useUserCartLength = () => {
  const userCartState = useContext(UserCartContext);
  if (!userCartState) {
    throw new Error("user Auth was not found");
  }
  const [userCart, setUserCart] = userCartState;
  return userCart.length;
};
