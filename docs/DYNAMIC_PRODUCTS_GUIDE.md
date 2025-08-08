# Dynamic Products Guide

## Overview
The website now supports dynamic product creation and management through the admin panel. Products created in the admin section will have their own dedicated pages that are accessible via URL.

## How It Works

### Before (Static Export)
- All product pages had to be pre-generated at build time
- Only products in the fallback JSON file were accessible
- New products required a full rebuild and redeploy

### Now (Dynamic Routes)
- Product pages are generated on-demand when accessed
- Products can be created, updated, and deleted through the admin panel
- New products are immediately accessible without rebuilding

## Product Management

### Creating Products
1. **Access Admin Panel**: Use `Ctrl+Shift+A` (desktop) or long-press logo (mobile)
2. **Navigate to Products**: Go to the main admin dashboard
3. **Add New Product**: Click the "Add Product" button
4. **Fill Details**:
   - Product name (auto-generates slug)
   - Category (select existing or create custom)
   - Price (in NGN)
   - Description
   - Features (one per line)
   - Images (upload or use URLs)
   - Stock status
   - Featured status
5. **Save**: Click "Create Product"

### Product URLs
- **Format**: `/products/[slug]`
- **Example**: `/products/ergonomic-office-chair`
- **Auto-generated**: Slug is created from the product name
- **SEO-friendly**: URLs are clean and descriptive

### Updating Products
1. **Find Product**: Use the admin panel to locate the product
2. **Edit**: Click the edit button on the product card
3. **Modify**: Update any fields as needed
4. **Save**: Click "Update Product"

### Deleting Products
1. **Find Product**: Use the admin panel to locate the product
2. **Delete**: Click the delete button (trash icon)
3. **Confirm**: Confirm the deletion
4. **Result**: Product is removed from database and website

## Technical Details

### Database Storage
- Products are stored in Supabase database
- Images are uploaded to Supabase Storage
- Fallback data is used when database is unavailable

### Dynamic Route Generation
- Product pages use Next.js dynamic routes (`[slug]`)
- Pages are generated server-side when accessed
- SEO metadata is generated dynamically

### Image Management
- Multiple images per product supported
- Images are stored in Supabase Storage
- Public URLs are generated for web access
- Fallback to external URLs if needed

## Benefits

### For Administrators
- **Real-time Updates**: Changes appear immediately
- **No Rebuild Required**: No need to rebuild after changes
- **Flexible Management**: Full CRUD operations through admin panel
- **Image Upload**: Built-in image management

### For Customers
- **Fresh Content**: Always see the latest products
- **Fast Access**: Pages load quickly with server-side generation
- **SEO Optimized**: Each product has its own optimized page

## Troubleshooting

### Product Not Found
- Check if the product exists in the admin panel
- Verify the slug is correct
- Ensure the product is not deleted

### Images Not Loading
- Check if images are uploaded to Supabase Storage
- Verify image URLs are accessible
- Check browser console for errors

### Admin Access Issues
- Ensure you're logged in with admin privileges
- Check Supabase configuration
- Verify environment variables are set

## Best Practices

### Product Creation
1. **Use Descriptive Names**: Clear, SEO-friendly product names
2. **Add Quality Images**: High-resolution images with good lighting
3. **Write Detailed Descriptions**: Include key features and benefits
4. **Set Appropriate Categories**: Use existing categories when possible
5. **Price Accurately**: Set realistic prices in NGN

### Image Management
1. **Optimize Images**: Compress images before upload
2. **Use Consistent Sizing**: Similar aspect ratios for better display
3. **Add Alt Text**: Descriptive alt text for accessibility
4. **Multiple Angles**: Show products from different perspectives

### Content Management
1. **Regular Updates**: Keep product information current
2. **Stock Management**: Update availability status regularly
3. **Featured Products**: Rotate featured products for engagement
4. **Category Organization**: Maintain logical category structure 