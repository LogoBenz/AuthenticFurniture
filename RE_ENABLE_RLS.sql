-- Re-enable RLS after auth is fixed
-- Run this once your authentication is working properly

-- Re-enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on warehouse_products table
ALTER TABLE warehouse_products ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'warehouse_products');

-- You should see rowsecurity = true for both tables

-- Then run the admin policies again from QUICK_FIX_SQL.sql
