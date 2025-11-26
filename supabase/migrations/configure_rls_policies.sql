-- Migration: Configure Row Level Security (RLS) policies
-- Created: 2025-01-21
-- Purpose: Enable public read access while restricting write operations to admins

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Public read access (SELECT) - anyone can view products
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- Admin write access (INSERT) - only authenticated admins
CREATE POLICY "Admins can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

-- Admin write access (UPDATE) - only authenticated admins
CREATE POLICY "Admins can update products"
ON products FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

-- Admin write access (DELETE) - only authenticated admins
CREATE POLICY "Admins can delete products"
ON products FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

-- ============================================================================
-- SPACES TABLE
-- ============================================================================

-- Enable RLS on spaces table
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public spaces are viewable by everyone" ON spaces;
DROP POLICY IF EXISTS "Admins can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can update spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can delete spaces" ON spaces;

-- Public read access
CREATE POLICY "Public spaces are viewable by everyone"
ON spaces FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can insert spaces"
ON spaces FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

CREATE POLICY "Admins can update spaces"
ON spaces FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

CREATE POLICY "Admins can delete spaces"
ON spaces FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

-- ============================================================================
-- SUBCATEGORIES TABLE
-- ============================================================================

-- Enable RLS on subcategories table
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public subcategories are viewable by everyone" ON subcategories;
DROP POLICY IF EXISTS "Admins can insert subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can update subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can delete subcategories" ON subcategories;

-- Public read access
CREATE POLICY "Public subcategories are viewable by everyone"
ON subcategories FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can insert subcategories"
ON subcategories FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

CREATE POLICY "Admins can update subcategories"
ON subcategories FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

CREATE POLICY "Admins can delete subcategories"
ON subcategories FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.jwt() ->> 'user_role' = 'admin'
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- You can verify the policies were created by running:
-- SELECT * FROM pg_policies WHERE tablename IN ('products', 'spaces', 'subcategories');
