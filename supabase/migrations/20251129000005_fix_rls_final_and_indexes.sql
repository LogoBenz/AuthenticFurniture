-- Fix RLS Performance Issues (Final) & Add Missing Indexes
-- 1. Create stable is_admin() function to force InitPlan optimization
-- 2. Update all admin policies to use (SELECT is_admin())
-- 3. Add missing indexes for foreign keys

-- ============================================================================
-- 1. HELPER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_role' = 'admin');
$$;

-- ============================================================================
-- 2. UPDATE RLS POLICIES
-- ============================================================================

-- Categories
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories" ON categories FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Products
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can insert products" ON products FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update products" ON products FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete products" ON products FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Spaces
DROP POLICY IF EXISTS "Admins can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can update spaces" ON spaces;
DROP POLICY IF EXISTS "Admins can delete spaces" ON spaces;

CREATE POLICY "Admins can insert spaces" ON spaces FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update spaces" ON spaces FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete spaces" ON spaces FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Subcategories
DROP POLICY IF EXISTS "Admins can insert subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can update subcategories" ON subcategories;
DROP POLICY IF EXISTS "Admins can delete subcategories" ON subcategories;

CREATE POLICY "Admins can insert subcategories" ON subcategories FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update subcategories" ON subcategories FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete subcategories" ON subcategories FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Warehouses
DROP POLICY IF EXISTS "Admins can insert warehouses" ON warehouses;
DROP POLICY IF EXISTS "Admins can update warehouses" ON warehouses;
DROP POLICY IF EXISTS "Admins can delete warehouses" ON warehouses;

CREATE POLICY "Admins can insert warehouses" ON warehouses FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update warehouses" ON warehouses FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete warehouses" ON warehouses FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Warehouse Products
DROP POLICY IF EXISTS "Admins can insert warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Admins can update warehouse_products" ON warehouse_products;
DROP POLICY IF EXISTS "Admins can delete warehouse_products" ON warehouse_products;

CREATE POLICY "Admins can insert warehouse_products" ON warehouse_products FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update warehouse_products" ON warehouse_products FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete warehouse_products" ON warehouse_products FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Blog Posts
DROP POLICY IF EXISTS "Admins can insert blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog_posts" ON blog_posts;

CREATE POLICY "Admins can insert blog_posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update blog_posts" ON blog_posts FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete blog_posts" ON blog_posts FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Color Options
DROP POLICY IF EXISTS "Admins can insert color_options" ON color_options;
DROP POLICY IF EXISTS "Admins can update color_options" ON color_options;
DROP POLICY IF EXISTS "Admins can delete color_options" ON color_options;

CREATE POLICY "Admins can insert color_options" ON color_options FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update color_options" ON color_options FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete color_options" ON color_options FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Product Variants
DROP POLICY IF EXISTS "Admins can insert product_variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can update product_variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can delete product_variants" ON product_variants;

CREATE POLICY "Admins can insert product_variants" ON product_variants FOR INSERT TO authenticated WITH CHECK ( (SELECT is_admin()) );
CREATE POLICY "Admins can update product_variants" ON product_variants FOR UPDATE TO authenticated USING ( (SELECT is_admin()) );
CREATE POLICY "Admins can delete product_variants" ON product_variants FOR DELETE TO authenticated USING ( (SELECT is_admin()) );

-- Stock Adjustments
DROP POLICY IF EXISTS "Admins can manage stock adjustments" ON stock_adjustments;

CREATE POLICY "Admins can manage stock adjustments" ON stock_adjustments FOR ALL TO authenticated USING ( (SELECT is_admin()) );

-- ============================================================================
-- 3. ADD MISSING INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_deliveries_customer_id ON deliveries(customer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_zone_id ON deliveries(zone_id);
CREATE INDEX IF NOT EXISTS idx_drivers_current_zone_id ON drivers(current_zone_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_products_product_id ON warehouse_products(product_id);