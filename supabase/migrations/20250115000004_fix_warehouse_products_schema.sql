-- Fix warehouse_products table schema to match API expectations
-- This migration updates the existing warehouse_products table to include all required columns

-- First, let's check if the table exists and what columns it has
-- If the table was created with the first migration, we need to add missing columns
-- If the table was created with the second migration, we need to ensure consistency

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add stock_quantity column if it doesn't exist (rename from stock_count if needed)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'warehouse_products' 
                   AND column_name = 'stock_quantity' 
                   AND table_schema = 'public') THEN
        -- Check if stock_count exists and rename it
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'warehouse_products' 
                   AND column_name = 'stock_count' 
                   AND table_schema = 'public') THEN
            ALTER TABLE public.warehouse_products RENAME COLUMN stock_count TO stock_quantity;
        ELSE
            ALTER TABLE public.warehouse_products ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0;
        END IF;
    END IF;

    -- Add reserved_quantity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'warehouse_products' 
                   AND column_name = 'reserved_quantity' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.warehouse_products ADD COLUMN reserved_quantity INTEGER DEFAULT 0;
    END IF;

    -- Add reorder_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'warehouse_products' 
                   AND column_name = 'reorder_level' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.warehouse_products ADD COLUMN reorder_level INTEGER DEFAULT 0;
    END IF;

    -- Add last_updated column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'warehouse_products' 
                   AND column_name = 'last_updated' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.warehouse_products ADD COLUMN last_updated TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add id column if it doesn't exist (for compatibility with some queries)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'warehouse_products' 
                   AND column_name = 'id' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.warehouse_products ADD COLUMN id UUID DEFAULT gen_random_uuid();
        
        -- Update existing rows to have unique IDs
        UPDATE public.warehouse_products SET id = gen_random_uuid() WHERE id IS NULL;
        
        -- Make id NOT NULL
        ALTER TABLE public.warehouse_products ALTER COLUMN id SET NOT NULL;
        
        -- Add unique constraint on id
        ALTER TABLE public.warehouse_products ADD CONSTRAINT warehouse_products_id_unique UNIQUE (id);
    END IF;
END $$;

-- Ensure the table has the correct primary key structure
-- If it only has composite key, add id as primary key
DO $$
BEGIN
    -- Check if there's a primary key constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'warehouse_products' 
        AND constraint_type = 'PRIMARY KEY' 
        AND table_schema = 'public'
        AND constraint_name LIKE '%id%'
    ) THEN
        -- Drop existing primary key if it exists
        ALTER TABLE public.warehouse_products DROP CONSTRAINT IF EXISTS warehouse_products_pkey;
        
        -- Add new primary key on id
        ALTER TABLE public.warehouse_products ADD CONSTRAINT warehouse_products_pkey PRIMARY KEY (id);
        
        -- Ensure unique constraint on warehouse_id, product_id combination
        ALTER TABLE public.warehouse_products ADD CONSTRAINT warehouse_products_warehouse_product_unique UNIQUE (warehouse_id, product_id);
    END IF;
END $$;

-- Update any NULL values in required columns
UPDATE public.warehouse_products 
SET stock_quantity = 0 WHERE stock_quantity IS NULL;

UPDATE public.warehouse_products 
SET reserved_quantity = 0 WHERE reserved_quantity IS NULL;

UPDATE public.warehouse_products 
SET reorder_level = 0 WHERE reorder_level IS NULL;

UPDATE public.warehouse_products 
SET last_updated = NOW() WHERE last_updated IS NULL;

-- Make sure stock_quantity is NOT NULL
ALTER TABLE public.warehouse_products ALTER COLUMN stock_quantity SET NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_warehouse_products_stock_quantity ON public.warehouse_products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_warehouse_products_reserved_quantity ON public.warehouse_products(reserved_quantity);
CREATE INDEX IF NOT EXISTS idx_warehouse_products_last_updated ON public.warehouse_products(last_updated);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
