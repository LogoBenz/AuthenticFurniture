-- Add enhanced product fields for improved product view page
-- This migration adds all the new fields needed for the enhanced product functionality

-- Add new columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bulk_pricing_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bulk_pricing_tiers jsonb,
ADD COLUMN IF NOT EXISTS ships_from text,
ADD COLUMN IF NOT EXISTS popular_with jsonb,
ADD COLUMN IF NOT EXISTS badges jsonb,
ADD COLUMN IF NOT EXISTS materials text,
ADD COLUMN IF NOT EXISTS weight_capacity text,
ADD COLUMN IF NOT EXISTS warranty text,
ADD COLUMN IF NOT EXISTS delivery_timeframe text,
ADD COLUMN IF NOT EXISTS stock_count integer,
ADD COLUMN IF NOT EXISTS limited_time_deal jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_ships_from ON public.products(ships_from);
CREATE INDEX IF NOT EXISTS idx_products_stock_count ON public.products(stock_count);
CREATE INDEX IF NOT EXISTS idx_products_discount_enabled ON public.products(discount_enabled);
CREATE INDEX IF NOT EXISTS idx_products_bulk_pricing_enabled ON public.products(bulk_pricing_enabled);

-- Add comments for documentation
COMMENT ON COLUMN public.products.discount_enabled IS 'Whether discount pricing is enabled for this product';
COMMENT ON COLUMN public.products.bulk_pricing_enabled IS 'Whether bulk pricing tiers are enabled for this product';
COMMENT ON COLUMN public.products.bulk_pricing_tiers IS 'JSON array of bulk pricing tiers with min_quantity, max_quantity, price, and discount_percent';
COMMENT ON COLUMN public.products.ships_from IS 'Primary shipping location (Lagos, Abuja, etc.)';
COMMENT ON COLUMN public.products.popular_with IS 'JSON array of target audiences (Schools, Offices, Hotels, etc.)';
COMMENT ON COLUMN public.products.badges IS 'JSON array of product badges (Best Seller, New Arrival, Limited Stock)';
COMMENT ON COLUMN public.products.materials IS 'Product materials description';
COMMENT ON COLUMN public.products.weight_capacity IS 'Maximum weight capacity';
COMMENT ON COLUMN public.products.warranty IS 'Warranty information';
COMMENT ON COLUMN public.products.delivery_timeframe IS 'Expected delivery timeframe';
COMMENT ON COLUMN public.products.stock_count IS 'Current stock count (null for unlimited)';
COMMENT ON COLUMN public.products.limited_time_deal IS 'JSON object with enabled, end_date, and discount_percent for limited time deals';

-- Update RLS policies to include new columns
-- The existing policies should already cover these new columns since they're on the same table

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
