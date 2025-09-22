-- Add videos column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb;

-- Create index for videos column for better performance
CREATE INDEX IF NOT EXISTS idx_products_videos ON public.products USING GIN (videos);

-- Update existing products to have empty videos array
UPDATE public.products 
SET videos = '[]'::jsonb 
WHERE videos IS NULL;

-- Add comment to the column
COMMENT ON COLUMN public.products.videos IS 'Array of video URLs for product videos';
