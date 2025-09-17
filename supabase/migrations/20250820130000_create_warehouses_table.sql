-- Create warehouses table
CREATE TABLE IF NOT EXISTS public.warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  address text,
  contact_phone text,
  contact_email text,
  map_link text,
  capacity integer,
  notes text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_warehouses_state ON public.warehouses(state);
CREATE INDEX IF NOT EXISTS idx_warehouses_available ON public.warehouses(is_available);

-- Add comments for documentation
COMMENT ON TABLE public.warehouses IS 'Warehouse locations for inventory management';
COMMENT ON COLUMN public.warehouses.name IS 'Warehouse name (e.g., Ikeja Warehouse)';
COMMENT ON COLUMN public.warehouses.state IS 'State/Region (e.g., Lagos, Abuja)';
COMMENT ON COLUMN public.warehouses.address IS 'Full address of the warehouse';
COMMENT ON COLUMN public.warehouses.contact_phone IS 'Contact phone number';
COMMENT ON COLUMN public.warehouses.contact_email IS 'Contact email address';
COMMENT ON COLUMN public.warehouses.map_link IS 'Google Maps or other map service link';
COMMENT ON COLUMN public.warehouses.capacity IS 'Storage capacity (optional)';
COMMENT ON COLUMN public.warehouses.notes IS 'Additional notes about the warehouse';
COMMENT ON COLUMN public.warehouses.is_available IS 'Whether the warehouse is available for new inventory';

-- Enable Row Level Security
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to view warehouses" ON public.warehouses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert warehouses" ON public.warehouses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update warehouses" ON public.warehouses
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete warehouses" ON public.warehouses
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO public.warehouses (name, state, address, contact_phone, contact_email, is_available) VALUES
  ('Ikeja Warehouse', 'Lagos', '123 Ikeja Industrial Estate, Lagos', '+234 801 234 5678', 'ikeja@company.com', true),
  ('Lekki Warehouse', 'Lagos', '456 Lekki Phase 1, Lagos', '+234 802 345 6789', 'lekki@company.com', true),
  ('Apapa Warehouse', 'Lagos', '789 Apapa Port, Lagos', '+234 803 456 7890', 'apapa@company.com', true),
  ('Garki Warehouse', 'Abuja', '321 Garki Area 11, Abuja', '+234 804 567 8901', 'garki@company.com', true),
  ('Wuse Warehouse', 'Abuja', '654 Wuse Zone 2, Abuja', '+234 805 678 9012', 'wuse@company.com', true),
  ('Port Harcourt Main', 'Port Harcourt', '987 Trans-Amadi, Port Harcourt', '+234 806 789 0123', 'ph@company.com', true),
  ('Kano Central', 'Kano', '147 Nasarawa GRA, Kano', '+234 807 890 1234', 'kano@company.com', true);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
