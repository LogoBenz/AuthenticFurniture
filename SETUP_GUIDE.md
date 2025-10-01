# 🚨 CRITICAL SETUP REQUIRED

Your application is experiencing multiple errors because **Supabase is not configured**. Here's how to fix it:

## 1. Create Environment File

Create a file called `.env.local` in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 2. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  features TEXT[],
  images TEXT[],
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  original_price DECIMAL(10,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  is_promo BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  model_no TEXT,
  warehouse_location TEXT,
  dimensions TEXT,
  space_id UUID,
  subcategory_id UUID,
  discount_enabled BOOLEAN DEFAULT false,
  bulk_pricing_enabled BOOLEAN DEFAULT false,
  bulk_pricing_tiers JSONB,
  ships_from TEXT,
  popular_with TEXT[],
  badges TEXT[],
  materials TEXT,
  weight_capacity TEXT,
  warranty TEXT,
  delivery_timeframe TEXT,
  stock_count INTEGER,
  limited_time_deal JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  map_link TEXT,
  capacity INTEGER,
  notes TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create warehouse_products junction table
CREATE TABLE IF NOT EXISTS warehouse_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stock_quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(warehouse_id, product_id)
);

-- Create stock_adjustments table
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('add', 'remove', 'set')),
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  adjusted_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(space_id, slug)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('product-images', 'product-images', true),
  ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public videos are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'product-videos');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-videos' AND auth.role() = 'authenticated');
```

## 4. Restart Your Development Server

After creating the `.env.local` file:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
# or
yarn dev
```

## 5. Test the Setup

1. Go to your admin panel: `http://localhost:3000/admin`
2. Try creating a product
3. Try managing warehouses
4. Check the browser console for any remaining errors

## Current Issues Fixed

✅ **API Endpoints**: Fixed 404/500 errors with better error handling
✅ **Supabase Connection**: Added proper configuration checks
✅ **Database Schema**: Provided complete SQL setup
✅ **Storage Buckets**: Configured for images and videos
✅ **Error Messages**: Added detailed logging for debugging

## Next Steps

Once Supabase is configured:
1. The product form will save all fields correctly
2. Warehouse deletion will work properly
3. Video uploads and image cropping will be functional
4. All API endpoints will respond correctly

**The main issue is missing environment variables - fix this first!**







