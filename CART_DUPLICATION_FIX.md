# Cart Duplication Fix

## Problem Description

The website was creating multiple carts (4 to be exact) for the exact same user when:
1. Refreshing the page
2. Adding items to the cart
3. Navigating between pages

This happened due to race conditions in cart creation logic and lack of proper database constraints.

## Root Causes

1. **Race Conditions**: Multiple components calling `getCart()` simultaneously could all attempt to create carts
2. **No Database Constraints**: Missing unique constraint on `user_id` in the `carts` table
3. **Inefficient Cart Creation**: The `getCartId()` function was called multiple times without proper synchronization
4. **Multiple useEffect Hooks**: Both Header and Cart components were calling cart functions on user state changes

## Solution Implemented

### 1. Code Changes

#### Updated `getCartId()` function in `src/utilities.tsx`
- Added proper error handling and try-catch blocks
- Used `upsert` with conflict resolution instead of simple `insert`
- Added retry logic for failed cart creation

#### Added new utility functions
- `cleanupDuplicateCarts()`: Removes duplicate carts, keeping the oldest one
- `getOrCreateCart()`: More robust cart creation with cleanup

#### Updated cart-related functions
- `addProductToCart()`: Now uses `getOrCreateCart()` instead of `getCartId()`
- `getCart()`: Now uses `getOrCreateCart()` for better reliability

#### Updated components
- `Header.tsx`: Added duplicate cart cleanup on user login
- `Cart/index.tsx`: Added duplicate cart cleanup when loading cart page

### 2. Database Schema Fixes

The `database_fix.sql` file contains SQL commands to:
- Add unique constraint on `user_id` column
- Create proper indexes for performance
- Add Row Level Security (RLS) policies
- Create database functions for safe cart operations
- Add triggers for automatic cart creation

## Implementation Steps

### Step 1: Apply Code Changes
The code changes have already been applied to prevent future duplications.

### Step 2: Clean Up Existing Duplicates
The application will automatically clean up duplicate carts when users log in or visit the cart page.

### Step 3: Apply Database Schema Fixes (Optional but Recommended)
Run the SQL commands in `database_fix.sql` in your Supabase SQL editor:

1. **Check for existing duplicates**:
   ```sql
   SELECT user_id, COUNT(*) as cart_count
   FROM carts
   GROUP BY user_id
   HAVING COUNT(*) > 1
   ORDER BY cart_count DESC;
   ```

2. **Add unique constraint** (after cleanup):
   ```sql
   ALTER TABLE carts 
   ADD CONSTRAINT unique_user_cart UNIQUE (user_id);
   ```

3. **Add indexes for performance**:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
   CREATE INDEX IF NOT EXISTS idx_carts_created_at ON carts(created_at);
   ```

## How the Fix Works

### 1. Prevention of New Duplicates
- `getOrCreateCart()` function ensures only one cart per user
- Database unique constraint prevents duplicate inserts
- Better error handling prevents race conditions

### 2. Cleanup of Existing Duplicates
- `cleanupDuplicateCarts()` function runs when users log in
- Keeps the oldest cart and removes newer duplicates
- Transfers cart items to the remaining cart before deletion

### 3. Improved Error Handling
- Try-catch blocks around all cart operations
- Graceful fallbacks when operations fail
- Better logging for debugging

## Testing the Fix

1. **Clear browser data** and log in again
2. **Refresh the page** multiple times - should see only one cart
3. **Add items to cart** - should not create new carts
4. **Navigate between pages** - cart count should remain consistent

## Monitoring

Check the browser console for:
- Cart cleanup messages: `"Cleaned up X duplicate carts for user Y"`
- Any remaining cart-related errors

## Future Improvements

1. **Database Triggers**: Automatically create carts when users sign up
2. **Caching**: Implement cart data caching to reduce database calls
3. **Optimistic Updates**: Update cart UI immediately, sync with database later
4. **Batch Operations**: Group cart operations to reduce database round trips

## Rollback Plan

If issues arise, you can:
1. Revert the code changes
2. Remove the unique constraint from the database
3. The cleanup functions will stop running automatically

## Support

If you encounter any issues after implementing this fix:
1. Check browser console for error messages
2. Verify database constraints are properly applied
3. Test with a fresh user account to isolate issues 