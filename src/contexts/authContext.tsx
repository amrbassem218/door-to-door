"use client";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
export interface UserAuthProfile {
  fullName: string | null;
  username: string | null;
  id: string | null;
}
export type UserAuthState = [
  UserAuthProfile | null,
  Dispatch<SetStateAction<UserAuthProfile | null>>
];
export const UserAuthProfileContext = createContext<UserAuthState | null>(null);

export const useUserAuthProfile = () => {
  const userAuthProfileState = useContext(UserAuthProfileContext);
  if(!userAuthProfileState){
    throw new Error('user Auth was not found')
  }
  if(!userAuthProfileState){
    
  }
  return userAuthProfileState;
};

