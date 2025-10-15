-- ============================================
-- ADMIN SECURITY SETUP - COMPLETE SQL SCRIPT
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- This sets up admin-only permissions for product management

-- STEP 1: Clean up any existing policies
-- ============================================
-- Products table
DROP POLICY IF EXISTS "Allow admin delete on products" ON products;
DROP POLICY IF EXISTS "Allow admin update on products" ON products;
DROP POLICY IF EXISTS "Allow admin insert on products" ON products;
DROP POLICY IF EXISTS "Allow public delete on products" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete on products" ON products;

-- Warehouse products (main inventory table)
DROP POLICY IF EXISTS "Allow admin delete on warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Allow public delete on warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Allow authenticated delete on warehouse_products" ON warehouse_products;

-- STEP 2: Create admin-only DELETE policies
-- ============================================
-- Products table (REQUIRED)
CREATE POLICY "Allow admin delete on products" 
ON products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Warehouse products table (main inventory - REQUIRED)
CREATE POLICY "Allow admin delete on warehouse_products" 
ON warehouse_products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Optional: Only run these if the tables exist and have RLS enabled
-- Uncomment the ones you need:

/*
CREATE POLICY "Allow admin delete on inventory_products" 
ON inventory_products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Allow admin delete on inventory" 
ON inventory 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Allow admin delete on product_inventory" 
ON product_inventory 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
*/

-- STEP 3: Create admin-only UPDATE policies
-- ============================================
CREATE POLICY "Allow admin update on products" 
ON products 
FOR UPDATE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- STEP 4: Create admin-only INSERT policies
-- ============================================
CREATE POLICY "Allow admin insert on products" 
ON products 
FOR INSERT 
TO authenticated 
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- STEP 5: Set YOUR user as admin
-- ============================================
-- ⚠️ IMPORTANT: Replace 'your-email@example.com' with YOUR actual email!
UPDATE auth.users 
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- STEP 6: Verify everything worked
-- ============================================
-- Check policies
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'warehouse_products')
ORDER BY tablename, cmd;

-- Check your admin role
SELECT 
  email,
  raw_user_meta_data ->> 'role' as role,
  created_at
FROM auth.users 
WHERE email = 'your-email@example.com';

-- ============================================
-- DONE! You should see:
-- - 3 policies for products (DELETE, UPDATE, INSERT)
-- - 1 policy for warehouse_products (DELETE)
-- - Your user with role = 'admin'
--
-- Note: warehouse_products is your main inventory table (70 rows)
-- Other inventory tables (inventory_products, etc.) are commented out
-- because they may not have RLS enabled. Uncomment if needed.
-- ============================================
