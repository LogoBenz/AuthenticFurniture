# Wishlist Migration Instructions

The wishlist table migration needs to be applied to your Supabase database.

## ❌ Current Status
The `wishlists` table does NOT exist in your database yet.

## ✅ How to Fix

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/nufciijehcapowhhggcl/sql
2. Click "New Query"
3. Copy the entire contents of: `supabase/migrations/20251028114253_create_wishlists_table.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Option 2: Install Supabase CLI

```powershell
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref nufciijehcapowhhggcl

# Push the migration
supabase db push
```

## 🧪 Verify Migration

After running the migration, verify it worked:

```powershell
node scripts/check-wishlist-table.js
```

You should see: ✅ wishlists table EXISTS!

## 📋 What the Migration Creates

- **Table**: `wishlists` with columns:
  - `id` (UUID, primary key)
  - `user_id` (UUID, references auth.users)
  - `product_id` (TEXT)
  - `created_at` (TIMESTAMP)

- **Indexes**: For fast queries on user_id, product_id, and created_at

- **RLS Policies**: 
  - Users can only view their own wishlist
  - Users can only add to their own wishlist
  - Users can only remove from their own wishlist

## 🚨 Important

Without this migration, the wishlist feature will NOT work. Users will get errors when trying to add items to their wishlist.
