/**
 * Routes Configuration
 * 
 * Centralized configuration for protected routes.
 * Add or remove routes here to manage authentication requirements.
 */

export interface RouteConfig {
  path: string;
  protected: boolean;
  redirectTo?: string; // Optional custom redirect path (defaults to /login)
}

/**
 * List of all routes with their protection status
 * 
 * To add a new protected route, simply add it to this array with protected: true
 * To make a route public, set protected: false or remove it from the array
 */
export const routes: RouteConfig[] = [
  // Protected routes
  // Use wildcard (*) to protect all nested routes
  { path: '/cart', protected: true },
  { path: '/account/*', protected: true },
  { path: '/add_product', protected: true },
  { path: '/location', protected: true },
];

/**
 * Default redirect path for unauthenticated users
 */
export const DEFAULT_LOGIN_REDIRECT = '/login';

/**
 * Check if a route is protected
 * 
 * @param pathname - The pathname to check (e.g., '/cart', '/account/settings')
 * @returns true if the route is protected, false otherwise
 */
export const isProtectedRoute = (pathname: string): boolean => {
  // Check exact match first
  const exactMatch = routes.find(route => route.path === pathname);
  if (exactMatch) {
    return exactMatch.protected;
  }
  
  // Check wildcard patterns and prefix matches
  const protectedRoutes = routes.filter(route => route.protected);
  return protectedRoutes.some(route => {
    // Handle wildcard patterns (e.g., '/account/*')
    if (route.path.endsWith('/*')) {
      const prefix = route.path.slice(0, -2); // Remove '/*'
      // Match if pathname starts with prefix (with or without trailing slash)
      // e.g., '/account/*' matches '/account', '/account/', '/account/settings', etc.
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    
    // Handle regular prefix matches (for backward compatibility)
    // This handles cases like /account/settings/profile when /account is listed
    return pathname.startsWith(route.path + '/') || pathname === route.path;
  });
};

/**
 * Get the redirect path for a protected route
 * 
 * @param pathname - The pathname to get redirect for
 * @returns The redirect path, or default login path
 */
export const getRedirectPath = (pathname: string): string => {
  // Try exact match first
  const exactMatch = routes.find(r => r.path === pathname);
  if (exactMatch) {
    return exactMatch.redirectTo || DEFAULT_LOGIN_REDIRECT;
  }
  
  // Check wildcard patterns and prefix matches
  const matchingRoutes = routes.filter(r => {
    if (r.path.endsWith('/*')) {
      const prefix = r.path.slice(0, -2);
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    return pathname.startsWith(r.path + '/') || pathname === r.path;
  });
  
  // Return the most specific match (longest path)
  const route = matchingRoutes.sort((a, b) => b.path.length - a.path.length)[0];
  return route?.redirectTo || DEFAULT_LOGIN_REDIRECT;
};

/**
 * Get route configuration for a specific path
 * 
 * @param pathname - The pathname to get config for
 * @returns RouteConfig or undefined if not found
 */
export const getRouteConfig = (pathname: string): RouteConfig | undefined => {
  // Try exact match first
  let route = routes.find(r => r.path === pathname);
  
  // If no exact match, find the most specific parent route (including wildcards)
  if (!route) {
    const matchingRoutes = routes.filter(r => {
      if (r.path.endsWith('/*')) {
        const prefix = r.path.slice(0, -2);
        return pathname === prefix || pathname.startsWith(prefix + '/');
      }
      return pathname.startsWith(r.path + '/') || pathname === r.path;
    });
    route = matchingRoutes.sort((a, b) => b.path.length - a.path.length)[0];
  }
  
  return route;
};

