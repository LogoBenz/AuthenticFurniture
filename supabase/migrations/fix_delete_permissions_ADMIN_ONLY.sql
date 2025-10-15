-- FULL SECURITY: Admin Role-Based Delete Permissions
-- Only users with admin role can delete products

-- First, drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow admin delete on products" ON products;
DROP POLICY IF EXISTS "Allow admin delete on warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Allow admin update on products" ON products;
DROP POLICY IF EXISTS "Allow admin insert on products" ON products;
DROP POLICY IF EXISTS "Allow public delete on products" ON products;
DROP POLICY IF EXISTS "Allow public delete on warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Allow authenticated delete on products" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete on warehouse_products" ON warehouse_products;

-- Step 1: Add admin role policy for products DELETE
CREATE POLICY "Allow admin delete on products" 
ON products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Step 2: Add admin role policy for warehouse_products DELETE
CREATE POLICY "Allow admin delete on warehouse_products" 
ON warehouse_products 
FOR DELETE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Step 3: Add admin policies for UPDATE (for consistency)
CREATE POLICY "Allow admin update on products" 
ON products 
FOR UPDATE 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Step 4: Add admin policies for INSERT (for consistency)
CREATE POLICY "Allow admin insert on products" 
ON products 
FOR INSERT 
TO authenticated 
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Verify policies were created
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'warehouse_products')
ORDER BY tablename, cmd, policyname;
