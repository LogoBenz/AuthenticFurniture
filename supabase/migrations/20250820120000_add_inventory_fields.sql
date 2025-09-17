-- Add inventory fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS model_no text,
ADD COLUMN IF NOT EXISTS warehouse_location text,
ADD COLUMN IF NOT EXISTS dimensions text;

-- Add comments for documentation
COMMENT ON COLUMN public.products.model_no IS 'Product model number for inventory tracking';
COMMENT ON COLUMN public.products.warehouse_location IS 'Warehouse location for inventory management';
COMMENT ON COLUMN public.products.dimensions IS 'Product dimensions (L x W x H)';

-- Update RLS policies to include new fields
-- Note: This assumes you already have RLS policies in place
-- If you need to create new policies, you would add them here

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
