-- Fix RLS Performance Issues (Iteration 3)
-- Use strict (select auth.jwt() ->> 'role') syntax to ensure InitPlan optimization

-- ============================================================================
-- CATEGORIES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update categories"
ON categories FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete categories"
ON categories FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update products"
ON products FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete products"
ON products FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- SPACES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can update spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can delete spaces" ON spaces;

CREATE POLICY "Admins can insert spaces"
ON spaces FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update spaces"
ON spaces FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete spaces"
ON spaces FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- SUBCATEGORIES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can update subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can delete subcategories" ON subcategories;

CREATE POLICY "Admins can insert subcategories"
ON subcategories FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update subcategories"
ON subcategories FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete subcategories"
ON subcategories FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- WAREHOUSES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert warehouses" ON warehouses;
DROP POLICY IF EXISTS "Admins can update warehouses" ON warehouses;
DROP POLICY IF EXISTS "Admins can delete warehouses" ON warehouses;

CREATE POLICY "Admins can insert warehouses"
ON warehouses FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update warehouses"
ON warehouses FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete warehouses"
ON warehouses FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- WAREHOUSE PRODUCTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Admins can update warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Admins can delete warehouse_products" ON warehouse_products;

CREATE POLICY "Admins can insert warehouse_products"
ON warehouse_products FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update warehouse_products"
ON warehouse_products FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete warehouse_products"
ON warehouse_products FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- BLOG POSTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog_posts" ON blog_posts;

CREATE POLICY "Admins can insert blog_posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update blog_posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete blog_posts"
ON blog_posts FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- COLOR OPTIONS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert color_options" ON color_options;
DROP POLICY IF EXISTS "Admins can update color_options" ON color_options;
DROP POLICY IF EXISTS "Admins can delete color_options" ON color_options;

CREATE POLICY "Admins can insert color_options"
ON color_options FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update color_options"
ON color_options FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete color_options"
ON color_options FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- PRODUCT VARIANTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert product_variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can update product_variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can delete product_variants" ON product_variants;

CREATE POLICY "Admins can insert product_variants"
ON product_variants FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can update product_variants"
ON product_variants FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

CREATE POLICY "Admins can delete product_variants"
ON product_variants FOR DELETE
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);

-- ============================================================================
-- STOCK ADJUSTMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage stock adjustments" ON stock_adjustments;

CREATE POLICY "Admins can manage stock adjustments"
ON stock_adjustments
FOR ALL
TO authenticated
USING (
  ((select auth.jwt() ->> 'role') = 'admin' OR (select auth.jwt() ->> 'user_role') = 'admin')
);
