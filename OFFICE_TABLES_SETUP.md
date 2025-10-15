# Office Tables Section - Complete Setup Guide

## 🎯 What You Got

A fully functional **Office Tables** section with filterable product types, matching the design from your Figma reference.

### Features
✅ 5 product type filters (Executive, Electric, Reception, Conference, Standard)
✅ Horizontal scrolling carousel with navigation arrows
✅ Product cards with images, prices, badges, and stock status
✅ Responsive design with dark mode support
✅ Smooth animations and transitions
✅ "Out of Stock" overlay
✅ Discount price display
✅ Add to cart buttons

---

## 📁 Files Created/Modified

### 1. **Type Definition** (`types/index.ts`)
- Added `product_type?: string` to Product interface

### 2. **Data Layer** (`lib/products.ts`)
- Added `product_type` mapping in `mapSupabaseRowToProduct()`
- Added `getProductsBySubcategory()` function
- Added `getProductsByType()` function

### 3. **UI Component** (`components/home/OfficeTablesSection.tsx`)
- Complete section with tabs and carousel
- Matches Figma design style

### 4. **Home Page** (`app/page.tsx`)
- Added OfficeTablesSection below NewArrivals
- Fetches products on server side

### 5. **Database Migration** (`supabase/migrations/add_product_type.sql`)
- SQL to add product_type column
- Indexes for performance

### 6. **Helper Script** (`scripts/assign-product-types.ts`)
- Automatically assigns types based on product names

### 7. **Documentation**
- `docs/PRODUCT_TYPES_GUIDE.md` - Complete feature guide
- `docs/ADMIN_PRODUCT_TYPE_EXAMPLE.md` - Admin integration examples
- `OFFICE_TABLES_SETUP.md` - This file

---

## 🚀 Quick Start (5 Steps)

### Step 1: Run Database Migration
Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Copy and paste from: supabase/migrations/add_product_type.sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_type ON products(subcategory_id, product_type);
```

### Step 2: Ensure Office Tables Subcategory Exists
Check in Supabase Dashboard → subcategories table:
- There should be a row with `slug = 'office-tables'`
- If not, create it:

```sql
INSERT INTO subcategories (name, slug, space_id, sort_order, is_active)
VALUES ('Office Tables', 'office-tables', [your-space-id], 1, true);
```

### Step 3: Assign Products to Office Tables
Make sure you have products with `subcategory_id` pointing to office-tables:

```sql
-- Check existing products
SELECT id, name, subcategory_id FROM products 
WHERE subcategory_id = (SELECT id FROM subcategories WHERE slug = 'office-tables');
```

### Step 4: Assign Product Types
**Option A - Automatic (Recommended):**
```bash
npx tsx scripts/assign-product-types.ts
```

**Option B - Manual:**
Go to Supabase Dashboard → products table and edit each product's `product_type` field.

### Step 5: View Your Website
Visit your homepage - the Office Tables section should appear below New Arrivals!

---

## 🎨 Product Types Available

1. **Executive Tables** - CEO desks, director tables, manager desks
2. **Electric Desks** - Height-adjustable, standing desks
3. **Reception Tables** - Front desk, lobby tables
4. **Conference Tables** - Meeting tables, boardroom tables
5. **Standard Tables** - General office tables

---

## 🔧 Customization

### Change Product Types
Edit `components/home/OfficeTablesSection.tsx`:

```typescript
const PRODUCT_TYPES = [
  "Executive Tables",
  "Electric Desks",
  "Reception Tables",
  "Conference Tables",
  "Standard Tables",
  "Your New Type", // Add here
];
```

### Change Colors
The section uses your existing color scheme:
- Primary: `bg-red-700` (active tab)
- Secondary: `bg-gray-100` (inactive tabs)
- Hover: `hover:bg-gray-200`

### Change Layout
Adjust the carousel in `OfficeTablesSection.tsx`:
- Card width: `w-72` (change to `w-64`, `w-80`, etc.)
- Gap between cards: `gap-6` (change to `gap-4`, `gap-8`, etc.)
- Scroll amount: `scrollAmount = 300` (in scrollContainer function)

---

## 📊 Database Schema

```sql
-- Products table now has:
products (
  id UUID PRIMARY KEY,
  name VARCHAR,
  subcategory_id UUID REFERENCES subcategories(id),
  product_type VARCHAR(100),  -- NEW FIELD
  price DECIMAL,
  -- ... other fields
)

-- Indexes for performance:
idx_products_product_type (product_type)
idx_products_subcategory_type (subcategory_id, product_type)
```

---

## 🔍 Troubleshooting

### Products not showing?
1. Check that products have `subcategory_id` set to office-tables
2. Verify `product_type` is set correctly
3. Check browser console for errors
4. Verify Supabase connection

### Types not filtering?
1. Ensure `product_type` values match exactly (case-sensitive)
2. Check that component is receiving products prop
3. Verify products have the correct subcategory

### Section not appearing?
1. Check that `app/page.tsx` imports and uses `<OfficeTablesSection />`
2. Verify products are being fetched: `await getProductsBySubcategory('office-tables')`
3. Check for TypeScript errors: `npm run build`

### Styling issues?
1. Ensure Tailwind CSS is configured correctly
2. Check that `scrollbar-hide` utility exists in `app/globals.css`
3. Verify dark mode classes are working

---

## 🎯 Next Steps

### 1. Add More Sections
Create similar sections for other subcategories:
- Gaming Chairs Section
- Office Chairs Section
- Storage Solutions Section

### 2. Add to Admin Panel
Integrate product type selection in your admin forms (see `docs/ADMIN_PRODUCT_TYPE_EXAMPLE.md`)

### 3. Add Search Filtering
Allow users to filter by product type in search results

### 4. Add Analytics
Track which product types are most popular

### 5. Add More Features
- Comparison tool
- Wishlist functionality
- Quick view modal
- Color variants

---

## 📞 Support

If you encounter issues:
1. Check the documentation files in `/docs`
2. Review the example code
3. Check Supabase logs for database errors
4. Verify environment variables are set

---

## ✅ Checklist

- [ ] Database migration run
- [ ] Office Tables subcategory exists
- [ ] Products assigned to subcategory
- [ ] Product types assigned
- [ ] Section appears on homepage
- [ ] Tabs filter correctly
- [ ] Carousel scrolls smoothly
- [ ] Cards display properly
- [ ] Dark mode works
- [ ] Mobile responsive

---

**You're all set! 🎉**

The Office Tables section is now live on your website with full filtering capabilities.
