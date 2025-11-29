-- Fix RLS Performance Issues (Iteration 2)
-- 1. Fix auth_rls_initplan: Wrap auth.jwt() checks in (SELECT ...)
-- 2. Fix multiple_permissive_policies: Split Admin policies into INSERT/UPDATE/DELETE where Public Read exists

-- ============================================================================
-- CATEGORIES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;

CREATE POLICY "Public can view categories"
ON categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update categories"
ON categories FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete categories"
ON categories FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;

CREATE POLICY "Public can view products"
ON products FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update products"
ON products FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete products"
ON products FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- SPACES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage spaces" ON spaces;
DROP POLICY IF EXISTS "Public can view spaces" ON spaces;

CREATE POLICY "Public can view spaces"
ON spaces FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert spaces"
ON spaces FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update spaces"
ON spaces FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete spaces"
ON spaces FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- SUBCATEGORIES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage subcategories" ON subcategories;
DROP POLICY IF EXISTS "Public can view subcategories" ON subcategories;

CREATE POLICY "Public can view subcategories"
ON subcategories FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert subcategories"
ON subcategories FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update subcategories"
ON subcategories FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete subcategories"
ON subcategories FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- WAREHOUSES
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage warehouses" ON warehouses;
DROP POLICY IF EXISTS "Allow authenticated users to view warehouses" ON warehouses;
DROP POLICY IF EXISTS "warehouses read" ON warehouses;
DROP POLICY IF EXISTS "warehouses_select_public" ON warehouses;

-- Assuming warehouses should be public read based on previous warnings
CREATE POLICY "Public can view warehouses"
ON warehouses FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert warehouses"
ON warehouses FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update warehouses"
ON warehouses FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete warehouses"
ON warehouses FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- WAREHOUSE PRODUCTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products read" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products_select_public" ON warehouse_products;

CREATE POLICY "Public can view warehouse_products"
ON warehouse_products FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert warehouse_products"
ON warehouse_products FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update warehouse_products"
ON warehouse_products FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete warehouse_products"
ON warehouse_products FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- BLOG POSTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete_admin" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_insert_admin" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_update_admin" ON blog_posts;

CREATE POLICY "Public can view blog posts"
ON blog_posts FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert blog_posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update blog_posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete blog_posts"
ON blog_posts FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- COLOR OPTIONS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage color options" ON color_options;
DROP POLICY IF EXISTS "Public can view color options" ON color_options;

CREATE POLICY "Public can view color options"
ON color_options FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert color_options"
ON color_options FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update color_options"
ON color_options FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete color_options"
ON color_options FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- PRODUCT VARIANTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
DROP POLICY IF EXISTS "Public can view product variants" ON product_variants;

CREATE POLICY "Public can view product variants"
ON product_variants FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can insert product_variants"
ON product_variants FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can update product_variants"
ON product_variants FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

CREATE POLICY "Admins can delete product_variants"
ON product_variants FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);

-- ============================================================================
-- STOCK ADJUSTMENTS
-- ============================================================================
DROP POLICY IF EXISTS "Admins can manage stock adjustments" ON stock_adjustments;

-- Stock adjustments seem to be admin-only, so we can keep a single policy for ALL
-- But to be safe and consistent with InitPlan fix, we'll wrap the check.
-- And since there is no public read, we don't strictly need to split it,
-- but splitting is safer to avoid any future overlap issues.

CREATE POLICY "Admins can manage stock adjustments"
ON stock_adjustments
FOR ALL
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin'))
);
