-- Add is_new column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_new boolean NOT NULL DEFAULT false;

-- Add comment to the column
COMMENT ON COLUMN public.products.is_new IS 'Indicates if the product is marked as new in the admin panel';

-- Update RLS policies to include the new column
-- The existing policies should already cover this column since they use SELECT * or specific column lists

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema';
