"use client";

import { getRedirectPath, isProtectedRoute } from "@/config/routes";
import { useUser } from "@/utils/getUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface RouteProtectionProps {
  children: ReactNode;
}

/**
 * RouteProtection Component
 *
 * Automatically protects routes based on the routes configuration.
 * This component should be added once in the providers file.
 * It checks the current pathname and redirects to login if the route is protected
 * and the user is not authenticated.
 */
export default function RouteProtection({ children }: RouteProtectionProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // Check if current route is protected
    if (isProtectedRoute(pathname) && !user) {
      const redirectPath = getRedirectPath(pathname);
      router.replace(redirectPath);
    }
  }, [user, loading, pathname, router]);

  // Show loading state while checking authentication
  if (loading && isProtectedRoute(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If route requires auth but user is not authenticated, show loading
  // (redirect will happen in useEffect)
  if (isProtectedRoute(pathname) && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Render children if authenticated or route doesn't require auth
  return <>{children}</>;
}
