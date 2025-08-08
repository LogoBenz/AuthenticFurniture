/*
  # Create products table with admin capabilities

  1. New Tables
    - `products`
      - `id` (bigint, primary key, auto-increment)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `category` (text, required)
      - `price` (numeric, required)
      - `description` (text, required)
      - `features` (text array)
      - `image_url` (text, required)
      - `images` (text array)
      - `in_stock` (boolean, default true)
      - `is_featured` (boolean, default false)
      - `created_at` (timestamp with timezone, default now)
      - `updated_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Functions
    - Auto-update `updated_at` timestamp
    - Auto-generate slug from name if not provided
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  description text NOT NULL,
  features text[] DEFAULT '{}',
  image_url text NOT NULL,
  images text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(trim(regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g')));
    NEW.slug := regexp_replace(NEW.slug, '\s+', '-', 'g');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-generating slug
CREATE TRIGGER generate_product_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_name();

-- Insert sample data
INSERT INTO products (name, slug, category, price, description, features, image_url, in_stock, is_featured) VALUES
('Ergonomic Office Chair', 'ergonomic-office-chair', 'Office Chairs', 75000, 'Premium ergonomic office chair with lumbar support, adjustable height, and 360-degree swivel. Perfect for long work hours with breathable mesh fabric for comfort in Nigerian climate.', ARRAY['Adjustable height and armrests', 'Breathable mesh back', 'Lumbar support', '360-degree swivel', 'Durable nylon base'], 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true, true),

('Luxury Lounge Chair', 'luxury-lounge-chair', 'Lounge Chairs', 120000, 'Elegant lounge chair with premium leather upholstery and solid wood frame. The perfect statement piece for executive offices or luxury home settings.', ARRAY['Premium leather upholstery', 'Solid wood frame', 'Ergonomic design', 'Plush cushioning', 'Available in multiple colors'], 'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true, true),

('Pro Gaming Chair', 'pro-gaming-chair', 'Gaming Chairs', 95000, 'High-performance gaming chair with racing-inspired design, adjustable features, and premium comfort for extended gaming sessions.', ARRAY['Racing-inspired design', 'Multi-level reclining', 'Adjustable headrest and lumbar support', 'Premium PU leather', 'Heavy-duty metal base'], 'https://images.pexels.com/photos/5082573/pexels-photo-5082573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true, false),

('Executive Conference Table', 'executive-conference-table', 'Conference Furniture', 450000, 'Premium 12-seater conference table with built-in power modules and elegant veneer finish. Perfect for corporate boardrooms and executive meeting spaces.', ARRAY['Seats 12 people comfortably', 'Built-in power and data modules', 'Premium wood veneer finish', 'Cable management system', 'Customizable size options'], 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true, true),

('Premium Leather Sofa Set', 'premium-leather-sofa-set', 'Living Room', 750000, 'Luxurious 5-seater leather sofa set including 3-seater sofa and two armchairs. Crafted with premium leather and solid wood frame for lasting comfort and elegance.', ARRAY['Genuine premium leather', 'Solid wood frame', 'High-density foam cushions', 'Customizable color options', '10-year frame warranty'], 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true, true);