"use client";

import { getRedirectPath, isProtectedRoute } from "@/config/routes";
import { useUser } from "@/utils/getUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * Optional custom loading component to show while checking authentication
   */
  loadingComponent?: ReactNode;
  /**
   * Optional custom redirect path (overrides route config)
   */
  redirectTo?: string;
  /**
   * If true, will check the current pathname automatically
   * If false, you must manually specify protection via the `requireAuth` prop
   */
  checkPathname?: boolean;
  /**
   * Manual override for protection requirement
   * If provided, this takes precedence over pathname checking
   */
  requireAuth?: boolean;
}

/**
 * ProtectedRoute Component
 *
 * Wraps content that requires authentication.
 * Automatically redirects to login if user is not authenticated.
 *
 * Usage:
 * ```tsx
 * // Automatic protection based on route config
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 *
 * // Manual protection
 * <ProtectedRoute requireAuth={true}>
 *   <YourComponent />
 * </ProtectedRoute>
 *
 * // Custom loading state
 * <ProtectedRoute loadingComponent={<CustomLoader />}>
 *   <YourComponent />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({
  children,
  loadingComponent,
  redirectTo,
  checkPathname = true,
  requireAuth,
}: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Determine if this route requires authentication
  const needsAuth =
    requireAuth !== undefined
      ? requireAuth
      : checkPathname
      ? isProtectedRoute(pathname)
      : false;

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // Only redirect if route requires auth and user is not authenticated
    if (needsAuth && !user) {
      const redirectPath = redirectTo || getRedirectPath(pathname);
      router.replace(redirectPath);
    }
  }, [user, loading, needsAuth, router, pathname, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
          </div>
        )}
      </>
    );
  }

  // If route requires auth but user is not authenticated, don't render children
  // (redirect will happen in useEffect)
  if (needsAuth && !user) {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to login...</p>
          </div>
        )}
      </>
    );
  }

  // Render children if authenticated or route doesn't require auth
  return <>{children}</>;
}
