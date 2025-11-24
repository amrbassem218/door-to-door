'use client'
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { UserProfile } from "./types/types";
export interface UserProfileState {
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
}
export const UserContext = createContext<UserProfileState | null>(null);

export const getProfile = () => {
  const profile = useContext(UserContext);
  return profile;
}


