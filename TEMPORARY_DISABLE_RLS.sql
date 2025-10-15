-- TEMPORARY: Disable RLS to allow deletions while we fix auth
-- ⚠️ ONLY USE THIS FOR TESTING ON LOCALHOST
-- ⚠️ RE-ENABLE RLS BEFORE DEPLOYING TO PRODUCTION

-- Disable RLS on products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on warehouse_products table  
ALTER TABLE warehouse_products DISABLE ROW LEVEL SECURITY;

-- To re-enable later (after fixing auth):
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE warehouse_products ENABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'warehouse_products');

-- You should see rowsecurity = false for both tables
