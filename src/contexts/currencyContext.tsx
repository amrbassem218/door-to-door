"use client";
import { defaultCurrency } from "@/components/currency/utils";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Currencies } from "../types/types";
export type UserCurrenciesState = [
  Currencies,
  Dispatch<SetStateAction<Currencies>>
];
export const UserCurrencyContext = createContext<UserCurrenciesState | null>(
 null 
);

export const useUserCurrency = () => {
  const userCurrencyState = useContext(UserCurrencyContext);
  if(!userCurrencyState) {
    throw new Error('user currency not found')
  }
  return userCurrencyState;
};

export const useUserCurrencyCode = () => {
  const userCurrencyState = useContext(UserCurrencyContext);
  if(!userCurrencyState) {
    throw new Error('user currency not found')
  }
  const [userCurrency, setUserCurrency] = userCurrencyState; 
  if(!userCurrency){
    console.log("userCurrency Not found");
  }
  return userCurrency?.currencyCode;
}