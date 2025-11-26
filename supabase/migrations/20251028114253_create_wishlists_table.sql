-- Create wishlists table for user favorite products
-- Migration: create_wishlists_table
-- Created: 2025-10-27

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_product UNIQUE(user_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON wishlists(created_at DESC);

-- Enable Row Level Security
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own wishlist
CREATE POLICY "Users can view own wishlist"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can add to their own wishlist
CREATE POLICY "Users can add to own wishlist"
  ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can remove from their own wishlist
CREATE POLICY "Users can remove from own wishlist"
  ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE wishlists IS 'Stores user wishlist/favorites for products';
COMMENT ON COLUMN wishlists.user_id IS 'Reference to authenticated user';
COMMENT ON COLUMN wishlists.product_id IS 'Product ID (stored as text to match products table)';
COMMENT ON COLUMN wishlists.created_at IS 'Timestamp when product was added to wishlist';
