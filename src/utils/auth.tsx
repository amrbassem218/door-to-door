"use client";

import { supabase } from "@/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleGoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/auth/callback`,
    },
  });
};

export const handlePasswordLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const handlePasswordSignup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/auth/callback`,
    },
  });
  if (error) {
    return { data, error };
  }
  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update([
        {
          id: userId,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        },
      ])
      .eq("id", userId);
    if (profileError) {
      console.log("Error creating user profile:", profileError.message);
      return { data, error: profileError };
    }
  }
  return { data, error };
};

export const requireAuth = (
  user: User | null,
  router: AppRouterInstance,
  redirectTo: string = "/login"
): boolean => {
  if (!user) {
    router.replace(redirectTo);
    return false;
  }
  return true;
};

/**
 * Higher-order function that wraps a function to require authentication
 * If user is not authenticated, redirects to login and returns early
 *
 * @param user - The current user object
 * @param router - Next.js router instance
 * @param fn - The function to execute if authenticated
 * @param redirectTo - Optional custom redirect path (defaults to /login)
 * @returns A function that checks auth before executing the original function
 *
 * @example
 * const handleAddToCart = withAuth(user, router, async () => {
 *   await addProductToCart(user, product, quantity);
 * });
 */
export const withAuth = <T extends (...args: any[]) => any>(
  user: User | null,
  router: AppRouterInstance,
  fn: T,
  redirectTo: string = "/login"
): ((...args: Parameters<T>) => ReturnType<T> | void) => {
  return (...args: Parameters<T>) => {
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    return fn(...args);
  };
};
