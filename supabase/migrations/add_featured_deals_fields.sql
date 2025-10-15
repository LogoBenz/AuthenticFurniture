-- Add featured deals fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_featured_deal BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deal_priority INTEGER DEFAULT 5;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_featured_deals 
ON products(is_featured_deal, deal_priority DESC) 
WHERE is_featured_deal = TRUE;

-- Add comment
COMMENT ON COLUMN products.is_featured_deal IS 'Whether this product is featured in Deals of the Week section';
COMMENT ON COLUMN products.deal_priority IS 'Priority for featured deals (1-10, higher = first). Top 2 = big cards, next 5 = normal cards';
