-- Fix RLS Performance Issues
-- 1. Optimize auth.uid() and auth.jwt() calls by wrapping them in (select ...)
-- 2. Consolidate multiple permissive policies into single efficient policies

-- Categories
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

CREATE POLICY "Admins can manage categories"
ON categories
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

-- Products
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Allow admin delete on products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Allow admin insert on products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "products write" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Allow admin update on products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "products update" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "products read" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;

CREATE POLICY "Admins can manage products"
ON products
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Public can view products"
ON products
FOR SELECT
TO public
USING (true);

-- Spaces
DROP POLICY IF EXISTS "Admins can delete spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can update spaces" ON spaces;
DROP POLICY IF EXISTS "Spaces are manageable by authenticated users" ON spaces;
DROP POLICY IF EXISTS "Enable read access for all users" ON spaces;
DROP POLICY IF EXISTS "Public spaces are viewable by everyone" ON spaces;
DROP POLICY IF EXISTS "Spaces are viewable by everyone" ON spaces;
DROP POLICY IF EXISTS "Admins can manage spaces" ON spaces;
DROP POLICY IF EXISTS "Public can view spaces" ON spaces;

CREATE POLICY "Admins can manage spaces"
ON spaces
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Public can view spaces"
ON spaces
FOR SELECT
TO public
USING (true);

-- Subcategories
DROP POLICY IF EXISTS "Admins can delete subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can insert subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can update subcategories" ON subcategories;
DROP POLICY IF EXISTS "Subcategories are manageable by authenticated users" ON subcategories;
DROP POLICY IF EXISTS "Allow public to read subcategories" ON subcategories;
DROP POLICY IF EXISTS "Enable read access for all users" ON subcategories;
DROP POLICY IF EXISTS "Public subcategories are viewable by everyone" ON subcategories;
DROP POLICY IF EXISTS "Subcategories are viewable by everyone" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to delete subcategories" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to insert subcategories" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to update subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can manage subcategories" ON subcategories;
DROP POLICY IF EXISTS "Public can view subcategories" ON subcategories;

CREATE POLICY "Admins can manage subcategories"
ON subcategories
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Public can view subcategories"
ON subcategories
FOR SELECT
TO public
USING (true);

-- Warehouses
DROP POLICY IF EXISTS "Allow authenticated users to delete warehouses" ON warehouses;
DROP POLICY IF EXISTS "Allow authenticated users to insert warehouses" ON warehouses;
DROP POLICY IF EXISTS "Allow authenticated users to update warehouses" ON warehouses;
DROP POLICY IF EXISTS "Allow authenticated users to view warehouses" ON warehouses;
DROP POLICY IF EXISTS "warehouses delete" ON warehouses;
DROP POLICY IF EXISTS "warehouses read" ON warehouses;
DROP POLICY IF EXISTS "warehouses_select_public" ON warehouses;
DROP POLICY IF EXISTS "warehouses_manage_admin" ON warehouses;
DROP POLICY IF EXISTS "Admins can manage warehouses" ON warehouses;

CREATE POLICY "Admins can manage warehouses"
ON warehouses
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

-- Warehouse Products
DROP POLICY IF EXISTS "Allow admin delete on warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products_manage_admin" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products upsert" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products read" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products_select_public" ON warehouse_products;
DROP POLICY IF EXISTS "warehouse_products update" ON warehouse_products;
DROP POLICY IF EXISTS "Admins can manage warehouse_products" ON warehouse_products;

CREATE POLICY "Admins can manage warehouse_products"
ON warehouse_products
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

-- Wishlists
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;

CREATE POLICY "Users can manage own wishlist"
ON wishlists
FOR ALL
TO authenticated
USING (
  user_id = (select auth.uid())
)
WITH CHECK (
  user_id = (select auth.uid())
);

-- Blog Posts
DROP POLICY IF EXISTS "blog_posts_select_all_admin" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_select_public" ON blog_posts;
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

CREATE POLICY "Public can view blog posts"
ON blog_posts
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage blog posts"
ON blog_posts
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

-- Color Options
DROP POLICY IF EXISTS "color_options_manage_admin" ON color_options;
DROP POLICY IF EXISTS "color_options_select_public" ON color_options;
DROP POLICY IF EXISTS "Public can view color options" ON color_options;
DROP POLICY IF EXISTS "Admins can manage color options" ON color_options;

CREATE POLICY "Public can view color options"
ON color_options
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage color options"
ON color_options
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

-- Product Variants
DROP POLICY IF EXISTS "product_variants_manage_admin" ON product_variants;
DROP POLICY IF EXISTS "product_variants_select_public" ON product_variants;
DROP POLICY IF EXISTS "Public can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;

CREATE POLICY "Public can view product variants"
ON product_variants
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage product variants"
ON product_variants
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);

-- Stock Adjustments
DROP POLICY IF EXISTS "stock_adjustments insert" ON stock_adjustments;
DROP POLICY IF EXISTS "stock_adjustments_insert_authenticated" ON stock_adjustments;
DROP POLICY IF EXISTS "stock_adjustments read" ON stock_adjustments;
DROP POLICY IF EXISTS "stock_adjustments_select_authenticated" ON stock_adjustments;
DROP POLICY IF EXISTS "Admins can manage stock adjustments" ON stock_adjustments;

CREATE POLICY "Admins can manage stock adjustments"
ON stock_adjustments
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'role') = 'admin' OR
  (select auth.jwt() ->> 'user_role') = 'admin'
);
