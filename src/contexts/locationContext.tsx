"use client";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { FullLocation } from "../types/types";
export type UserLocation = [
  FullLocation | null,
  Dispatch<SetStateAction<FullLocation | null>>
];
export const UserLocationContext = createContext<UserLocation | null>(null);

export const useUserLocation = () => {
  const userLocation = useContext(UserLocationContext);
  if(!userLocation){
    throw new Error('user Location was not found')
  }
  return userLocation;
};
