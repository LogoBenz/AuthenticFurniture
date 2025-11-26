-- Migration: Add indexes for product query optimization
-- Created: 2025-01-21
-- Purpose: Improve query performance for filtering and searching products

-- Single column indexes for common filters
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products (subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_space_id ON products (space_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products (in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_space_subcategory ON products (space_id, subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_space_price ON products (space_id, price);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_price ON products (subcategory_id, price);
CREATE INDEX IF NOT EXISTS idx_products_in_stock_created_at ON products (in_stock, created_at DESC);

-- Index for featured products (if you have this column)
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured) WHERE is_featured = true;

-- Full-text search index for product search
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING gin(to_tsvector('english', description));

-- Comment for documentation
COMMENT ON INDEX idx_products_subcategory_id IS 'Speeds up filtering by subcategory';
COMMENT ON INDEX idx_products_space_id IS 'Speeds up filtering by space';
COMMENT ON INDEX idx_products_price IS 'Speeds up price range filtering';
COMMENT ON INDEX idx_products_slug IS 'Speeds up product detail page lookups';
COMMENT ON INDEX idx_products_space_subcategory IS 'Optimizes combined space and subcategory filters';
