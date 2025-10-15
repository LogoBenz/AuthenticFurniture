# 🔒 Admin Security Setup - Complete Guide

## Overview
This setup implements **role-based access control** where only users with the `admin` role can:
- Delete products
- Update products
- Create products
- Access the admin panel

## Step-by-Step Setup

### Step 1: Run the Security Migration

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- File: supabase/migrations/fix_delete_permissions_ADMIN_ONLY.sql

CREATE POLICY IF NOT EXISTS "Allow admin delete on products" 
ON products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY IF NOT EXISTS "Allow admin delete on warehouse_products" 
ON warehouse_products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY IF NOT EXISTS "Allow admin update on products" 
ON products 
FOR UPDATE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY IF NOT EXISTS "Allow admin insert on products" 
ON products 
FOR INSERT 
TO authenticated 
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
```

### Step 2: Set Your User as Admin

In **Supabase Dashboard → SQL Editor**, run:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users 
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT 
  email,
  raw_user_meta_data ->> 'role' as role
FROM auth.users 
WHERE email = 'your-email@example.com';
```

You should see `role: admin` in the results.

### Step 3: Install Required Packages

```bash
npm install @supabase/auth-helpers-nextjs
```

### Step 4: Update Your Admin Pages to Use Authenticated Client

The admin pages need to use the authenticated Supabase client. Update your imports:

```typescript
// OLD (in admin pages)
import { supabase } from '@/lib/supabase-simple';

// NEW (in admin pages)
import { createAuthenticatedClient } from '@/lib/supabase-auth';
const supabase = createAuthenticatedClient();
```

### Step 5: Set Up Environment Variables

Add to your `.env.local`:

```env
# Your existing variables
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Add this for server-side admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the service role key from **Supabase Dashboard → Settings → API**.

### Step 6: Test the Setup

1. **Log in to your admin panel** with your admin email
2. **Try to delete a product** - it should work
3. **Log out and try to access `/admin`** - you should be redirected to login
4. **Log in with a non-admin user** - you should see "Access Denied"

## Security Features Implemented

### ✅ Row Level Security (RLS)
- Only admins can DELETE products
- Only admins can UPDATE products
- Only admins can INSERT products
- Everyone can SELECT (read) products

### ✅ Route Protection
- `/admin/*` routes require authentication
- Non-admin users are redirected to `/unauthorized`
- Unauthenticated users are redirected to `/login`

### ✅ Role-Based Access
- Admin role stored in user metadata
- Checked at database level (RLS policies)
- Checked at application level (middleware)

## How to Add More Admins

### Option 1: Via SQL (Recommended)
```sql
UPDATE auth.users 
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'new-admin@example.com';
```

### Option 2: Via Supabase Dashboard
1. Go to **Authentication → Users**
2. Click on the user
3. Scroll to **User Metadata**
4. Add: `{"role": "admin"}`
5. Save

### Option 3: Programmatically (in your app)
```typescript
import { createServerAuthClient } from '@/lib/supabase-auth';

async function makeUserAdmin(userId: string) {
  const supabase = createServerAuthClient();
  
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: 'admin' }
  });
}
```

## Troubleshooting

### "Permission denied" when deleting
**Cause:** User doesn't have admin role or not authenticated

**Fix:**
1. Check if logged in: `supabase.auth.getUser()`
2. Check role: `user.user_metadata?.role`
3. Verify SQL policy is active: Run the migration again

### "No rows deleted" but no error
**Cause:** RLS policy is blocking silently

**Fix:**
1. Verify user has admin role in database
2. Check that admin pages use authenticated client
3. Verify JWT token includes role

### Can't access admin panel
**Cause:** Middleware is blocking access

**Fix:**
1. Make sure you're logged in
2. Verify your user has admin role
3. Check middleware.ts is configured correctly

## Testing Commands

```bash
# Test if user has admin role
node scripts/check-admin-role.js your-email@example.com

# Test deletion with admin user
node scripts/test-admin-delete.js
```

## Security Checklist

- [ ] RLS policies created for DELETE, UPDATE, INSERT
- [ ] At least one user has admin role
- [ ] Middleware protects `/admin` routes
- [ ] Admin pages use authenticated Supabase client
- [ ] Service role key is in `.env.local` (not committed to git)
- [ ] Unauthorized page exists
- [ ] Login page exists
- [ ] Tested: Admin can delete products
- [ ] Tested: Non-admin cannot delete products
- [ ] Tested: Unauthenticated users redirected to login

## What's Protected Now

✅ **Products Table:**
- DELETE: Admin only
- UPDATE: Admin only
- INSERT: Admin only
- SELECT: Everyone (public can view products)

✅ **Warehouse Products (Inventory):**
- DELETE: Admin only
- UPDATE: Admin only
- INSERT: Admin only
- SELECT: Everyone

✅ **Admin Routes:**
- `/admin/*`: Authenticated admins only
- Redirects to login if not authenticated
- Shows "Access Denied" if not admin

## Next Steps

1. Run the SQL migration
2. Set your user as admin
3. Install auth helpers package
4. Test deletion - it should work now!
5. Add more admins as needed

Your admin panel is now fully secured! 🔒
