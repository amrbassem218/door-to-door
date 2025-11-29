"use client";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
export interface UserLanguage {
  name: string;
  langCode: string;
  countryCode: string;
}
export type UserLangState = [
  UserLanguage,
  Dispatch<SetStateAction<UserLanguage>>
];
export const UserLangContext = createContext<UserLangState | null>(null);

export const useUserLang = () => {
  const userLangState = useContext(UserLangContext);
  if (!userLangState) {
    throw new Error("Lang was not found");
  }
  return userLangState;
};
