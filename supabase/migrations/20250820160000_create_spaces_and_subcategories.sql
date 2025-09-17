-- Create spaces table (top-level categories like Home, Office, etc.)
CREATE TABLE IF NOT EXISTS public.spaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Icon name for UI
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table (nested under spaces)
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Icon name for UI
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(space_id, slug)
);

-- Add space_id and subcategory_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS space_id UUID REFERENCES public.spaces(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spaces_slug ON public.spaces(slug);
CREATE INDEX IF NOT EXISTS idx_spaces_sort_order ON public.spaces(sort_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_space_id ON public.subcategories(space_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_sort_order ON public.subcategories(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_space_id ON public.products(space_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);

-- Enable RLS
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for spaces
CREATE POLICY "Spaces are viewable by everyone" ON public.spaces
  FOR SELECT USING (is_active = true);

CREATE POLICY "Spaces are manageable by authenticated users" ON public.spaces
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for subcategories
CREATE POLICY "Subcategories are viewable by everyone" ON public.subcategories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Subcategories are manageable by authenticated users" ON public.subcategories
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default spaces
INSERT INTO public.spaces (name, slug, description, icon, sort_order) VALUES
('Home', 'home', 'Furniture for residential spaces', 'Home', 1),
('Office', 'office', 'Professional office furniture', 'Briefcase', 2),
('Hotel / Lounge / Commercial', 'commercial', 'Furniture for hospitality and commercial spaces', 'Building', 3),
('Outdoor', 'outdoor', 'Weather-resistant outdoor furniture', 'TreePine', 4);

-- Insert default subcategories
-- Home subcategories
INSERT INTO public.subcategories (space_id, name, slug, description, icon, sort_order) VALUES
((SELECT id FROM public.spaces WHERE slug = 'home'), 'Sofa Sets', 'sofa-sets', 'Complete living room sofa collections', 'Sofa', 1),
((SELECT id FROM public.spaces WHERE slug = 'home'), 'Beds', 'beds', 'Bedroom furniture and bed frames', 'Bed', 2),
((SELECT id FROM public.spaces WHERE slug = 'home'), 'Cabinets', 'cabinets', 'Storage cabinets and wardrobes', 'Archive', 3),
((SELECT id FROM public.spaces WHERE slug = 'home'), 'Dining Sets', 'dining-sets', 'Complete dining room furniture', 'Table', 4);

-- Office subcategories
INSERT INTO public.subcategories (space_id, name, slug, description, icon, sort_order) VALUES
((SELECT id FROM public.spaces WHERE slug = 'office'), 'Desks & Tables', 'desks-tables', 'Office desks and work tables', 'Table', 1),
((SELECT id FROM public.spaces WHERE slug = 'office'), 'Office Chairs', 'office-chairs', 'Ergonomic office seating', 'GraduationCap', 2),
((SELECT id FROM public.spaces WHERE slug = 'office'), 'Conference Tables', 'conference-tables', 'Meeting and conference room tables', 'Users', 3),
((SELECT id FROM public.spaces WHERE slug = 'office'), 'Reception Desks', 'reception-desks', 'Front desk and reception furniture', 'Building', 4);

-- Commercial subcategories
INSERT INTO public.subcategories (space_id, name, slug, description, icon, sort_order) VALUES
((SELECT id FROM public.spaces WHERE slug = 'commercial'), 'Waiting Chairs', 'waiting-chairs', 'Comfortable seating for waiting areas', 'Armchair', 1),
((SELECT id FROM public.spaces WHERE slug = 'commercial'), 'Lounge Sofas', 'lounge-sofas', 'Relaxed seating for lounges', 'Sofa', 2),
((SELECT id FROM public.spaces WHERE slug = 'commercial'), 'Bar Tables', 'bar-tables', 'High tables for bars and cafes', 'Table', 3),
((SELECT id FROM public.spaces WHERE slug = 'commercial'), 'Banquet Chairs', 'banquet-chairs', 'Stackable chairs for events', 'GraduationCap', 4);

-- Outdoor subcategories
INSERT INTO public.subcategories (space_id, name, slug, description, icon, sort_order) VALUES
((SELECT id FROM public.spaces WHERE slug = 'outdoor'), 'Garden Furniture', 'garden-furniture', 'Weather-resistant garden seating', 'TreePine', 1),
((SELECT id FROM public.spaces WHERE slug = 'outdoor'), 'Pool Chairs', 'pool-chairs', 'Water-resistant poolside furniture', 'Sun', 2),
((SELECT id FROM public.spaces WHERE slug = 'outdoor'), 'Patio Sets', 'patio-sets', 'Complete outdoor dining sets', 'Table', 3);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON public.subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema';
