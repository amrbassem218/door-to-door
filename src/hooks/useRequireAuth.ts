"use client";

import { withAuth } from "@/utils/auth";
import { useUser } from "@/utils/getUser";
import { useRouter } from "next/navigation";

/**
 * React hook that provides a function to execute callbacks only if user is authenticated
 * Automatically redirects to login if user is not authenticated
 *
 * @param redirectTo - Optional custom redirect path (defaults to /login)
 * @returns An object with executeWithAuth function
 *
 * @example
 * ```tsx
 * const { executeWithAuth } = useRequireAuth();
 *
 * const handleAddToCart = () => {
 *   executeWithAuth(async () => {
 *     await addProductToCart(user, product, quantity);
 *   });
 * };
 * ```
 */
export const useRequireAuth = (redirectTo: string = "/login") => {
  const { user } = useUser();
  const router = useRouter();

  const executeWithAuth = <T extends (...args: any[]) => any>(
    fn: T
  ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
    return withAuth(user, router, fn, redirectTo);
  };

  return { executeWithAuth };
};
