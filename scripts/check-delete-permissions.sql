-- Check RLS policies on products table
-- Run this in your Supabase SQL Editor

-- 1. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- 2. Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- 3. If RLS is blocking deletes, you can either:
--    A. Disable RLS (not recommended for production):
--       ALTER TABLE products DISABLE ROW LEVEL SECURITY;
--
--    B. Add a policy to allow deletes (recommended):
--       CREATE POLICY "Allow public delete on products" 
--       ON products FOR DELETE 
--       USING (true);
--
--    C. Add a policy for authenticated users only:
--       CREATE POLICY "Allow authenticated delete on products" 
--       ON products FOR DELETE 
--       TO authenticated 
--       USING (true);
