-- Create junction table for product spaces
CREATE TABLE IF NOT EXISTS public.product_spaces (
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, space_id)
);

-- Create junction table for product subcategories
CREATE TABLE IF NOT EXISTS public.product_subcategories (
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, subcategory_id)
);

-- Enable RLS
ALTER TABLE public.product_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_subcategories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_spaces
CREATE POLICY "Product spaces are viewable by everyone" ON public.product_spaces
  FOR SELECT USING (true);

CREATE POLICY "Product spaces are manageable by authenticated users" ON public.product_spaces
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for product_subcategories
CREATE POLICY "Product subcategories are viewable by everyone" ON public.product_subcategories
  FOR SELECT USING (true);

CREATE POLICY "Product subcategories are manageable by authenticated users" ON public.product_subcategories
  FOR ALL USING (auth.role() = 'authenticated');

-- Migrate existing data
INSERT INTO public.product_spaces (product_id, space_id)
SELECT id, space_id FROM public.products WHERE space_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.product_subcategories (product_id, subcategory_id)
SELECT id, subcategory_id FROM public.products WHERE subcategory_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_spaces_product_id ON public.product_spaces(product_id);
CREATE INDEX IF NOT EXISTS idx_product_spaces_space_id ON public.product_spaces(space_id);
CREATE INDEX IF NOT EXISTS idx_product_subcategories_product_id ON public.product_subcategories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_subcategories_subcategory_id ON public.product_subcategories(subcategory_id);

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema';
