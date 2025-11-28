-- Fix RLS Security Issues
-- 1. Enable RLS on categories
-- 2. Fix insecure user_metadata references in products and warehouse_products policies

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

-- Create secure policies
CREATE POLICY "Public categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE TO authenticated USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE TO authenticated USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================

-- Drop insecure policies that reference user_metadata
DROP POLICY IF EXISTS "Allow admin delete on products" ON public.products;
DROP POLICY IF EXISTS "Allow admin update on products" ON public.products;
DROP POLICY IF EXISTS "Allow admin insert on products" ON public.products;

-- Re-create secure policies using app_metadata
CREATE POLICY "Allow admin delete on products"
ON public.products
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Allow admin update on products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Allow admin insert on products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- ============================================================================
-- WAREHOUSE_PRODUCTS TABLE
-- ============================================================================

-- Drop insecure policies that reference user_metadata
DROP POLICY IF EXISTS "Allow admin delete on warehouse_products" ON public.warehouse_products;

-- Re-create secure policies using app_metadata
CREATE POLICY "Allow admin delete on warehouse_products"
ON public.warehouse_products
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
