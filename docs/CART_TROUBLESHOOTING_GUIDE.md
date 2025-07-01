# E-Commerce Cart System Troubleshooting & Implementation Guide

## 1. Cart Functionality Debug Guide

### Current Cart System Analysis

The cart system uses a custom hook `useEnquiryCart` with localStorage persistence. Here are the key debugging steps:

#### A. Verify "Add to Cart" Button Event Handler

**Location**: `components/products/ProductCard.tsx` (lines 25-50)

**Debug Steps**:
1. Open browser DevTools → Console
2. Add this debug code to `handleCartAction`:

```typescript
const handleCartAction = useCallback(async (e: React.MouseEvent) => {
  console.log('🛒 Cart action triggered:', { 
    productId: product.id, 
    isInCart: isProductInCart,
    isLoaded,
    inStock 
  });
  
  e.preventDefault();
  e.stopPropagation();
  
  if (!isLoaded || !inStock || isProcessing) {
    console.warn('❌ Cart action blocked:', { isLoaded, inStock, isProcessing });
    return;
  }

  setIsProcessing(true);
  
  try {
    if (isProductInCart) {
      console.log('🗑️ Removing from cart:', product.name);
      removeFromCart(product.id);
    } else {
      console.log('➕ Adding to cart:', product.name);
      addToCart(product);
    }
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 300);
  } catch (error) {
    console.error("❌ Cart action error:", error);
    setIsProcessing(false);
  }
}, [addToCart, removeFromCart, product, isLoaded, inStock, isProductInCart, isProcessing]);
```

#### B. Confirm Cart State Updates

**Location**: `hooks/use-enquiry-cart.ts`

**Debug Steps**:
1. Add state logging to the hook:

```typescript
// Add this useEffect to monitor cart changes
useEffect(() => {
  console.log('🛒 Cart state updated:', {
    itemCount: cartItems.length,
    items: cartItems.map(item => ({ id: item.product.id, name: item.product.name }))
  });
}, [cartItems]);
```

2. Test the `addToCart` function:

```typescript
const addToCart = useCallback((product: Product) => {
  console.log('🛒 addToCart called:', product.name);
  
  if (!product || typeof product.id !== 'number') {
    console.error("❌ Invalid product data:", product);
    return false;
  }

  setCartItems(prev => {
    const exists = prev.find(item => item.product.id === product.id);
    if (exists) {
      console.log('⚠️ Product already in cart:', product.name);
      return prev;
    }
    
    const newItem: EnquiryCartItem = { 
      product, 
      addedAt: new Date() 
    };
    
    const newCart = [newItem, ...prev];
    console.log('✅ Product added to cart. New count:', newCart.length);
    return newCart;
  });
  return true;
}, []);
```

#### C. Check localStorage Persistence

**Debug localStorage**:
1. Open DevTools → Application → Local Storage
2. Look for key: `authentic-furniture-enquiry-cart`
3. Add this debug function:

```typescript
// Add to useEnquiryCart hook
const debugStorage = useCallback(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    console.log('💾 localStorage data:', {
      raw: stored,
      parsed: stored ? JSON.parse(stored) : null,
      currentCart: cartItems
    });
  }
}, [cartItems]);

// Call this in useEffect
useEffect(() => {
  debugStorage();
}, [cartItems, debugStorage]);
```

#### D. Validate Cart Display Re-rendering

**Location**: `components/products/EnquiryCartModal.tsx`

**Debug Steps**:
1. Add render logging:

```typescript
// Add at the top of the component
console.log('🔄 EnquiryCartModal render:', {
  isOpen,
  cartItemsCount: cartItems.length,
  isLoaded
});
```

2. Check if the floating button updates:

```typescript
// In FloatingEnquiryButton component
console.log('🔄 FloatingEnquiryButton render:', {
  mounted,
  isLoaded,
  cartCount
});
```

## 2. Price Update Error Solutions

### Current Issue Analysis

The price update error typically occurs in the admin panel when updating product prices.

#### A. Ensure Unique Product ID

**Location**: `app/admin/page.tsx` (handleSubmit function)

**Fix**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isSupabaseConfigured) {
    alert("Supabase is not configured. Please set up your environment variables to manage products.");
    return;
  }

  // Validate product ID for updates
  if (editingProduct && (!editingProduct.id || typeof editingProduct.id !== 'number')) {
    alert("Invalid product ID. Cannot update product.");
    return;
  }

  // Validate price format
  const priceValue = parseFloat(formData.price);
  if (isNaN(priceValue) || priceValue < 0) {
    alert("Please enter a valid price (must be a positive number).");
    return;
  }

  // ... rest of the function
};
```

#### B. Validate Price Format

**Location**: `lib/products.ts` (updateProduct function)

**Enhanced Error Handling**:
```typescript
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot update products.');
  }

  // Validate ID
  if (!id || typeof id !== 'number' || id <= 0) {
    throw new Error('Invalid product ID provided.');
  }

  // Validate price if provided
  if (updates.price !== undefined) {
    const price = Number(updates.price);
    if (isNaN(price) || price < 0) {
      throw new Error('Price must be a valid positive number.');
    }
    updates.price = price;
  }

  try {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.features !== undefined) updateData.features = updates.features;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;
    if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;

    console.log('🔄 Updating product:', { id, updateData });

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw new Error(`Database update failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from update operation.');
    }

    console.log('✅ Product updated successfully:', data);
    return mapSupabaseRowToProduct(data);
  } catch (error) {
    console.error('❌ Update product error:', error);
    throw error;
  }
}
```

#### C. Return Single JSON Object

**Database Query Fix**:
The `.single()` method ensures only one record is returned. If you're getting multiple records, check for:

1. Duplicate IDs in database
2. Incorrect WHERE clause
3. Missing unique constraints

**Verification Query**:
```sql
-- Run this in Supabase SQL Editor to check for duplicates
SELECT id, COUNT(*) as count 
FROM products 
GROUP BY id 
HAVING COUNT(*) > 1;
```

## 3. Secure Image Upload Implementation

### A. Add File Input to Product Form

**Location**: `app/admin/page.tsx`

**Enhanced Form with Image Upload**:
```typescript
// Add to formData state
const [formData, setFormData] = useState({
  name: "",
  category: "",
  price: "",
  description: "",
  features: "",
  imageUrl: "",
  imageFile: null as File | null, // Add this
  inStock: true,
  isFeatured: false,
});

// Add image upload state
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);
const [imagePreview, setImagePreview] = useState<string>("");
```

**File Input Component**:
```typescript
// Add this to the form in the Dialog
<div>
  <Label htmlFor="imageFile">Product Image</Label>
  <div className="space-y-4">
    <Input
      id="imageFile"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      onChange={handleImageFileChange}
      className="cursor-pointer"
    />
    
    {/* Image Preview */}
    {imagePreview && (
      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
        <Image
          src={imagePreview}
          alt="Preview"
          fill
          className="object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-1 right-1"
          onClick={clearImagePreview}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    )}
    
    {/* Upload Progress */}
    {isUploading && (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Uploading...</span>
          <span>{uploadProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      </div>
    )}
    
    {/* Fallback URL Input */}
    <div>
      <Label htmlFor="imageUrl">Or Image URL</Label>
      <Input
        id="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
        placeholder="https://example.com/image.jpg"
        disabled={!!formData.imageFile}
      />
    </div>
  </div>
</div>
```

### B. Image Upload Handler Functions

```typescript
// Add these functions to the admin component
const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
    return;
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    alert('File size must be less than 5MB.');
    return;
  }

  setFormData({...formData, imageFile: file, imageUrl: ""});
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    setImagePreview(e.target?.result as string);
  };
  reader.readAsDataURL(file);
};

const clearImagePreview = () => {
  setFormData({...formData, imageFile: null});
  setImagePreview("");
};

const uploadImageToSupabase = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured for image upload.');
  }

  setIsUploading(true);
  setUploadProgress(0);

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    setUploadProgress(100);
    return publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  } finally {
    setIsUploading(false);
    setTimeout(() => setUploadProgress(0), 1000);
  }
};
```

### C. Enhanced Submit Handler with Image Upload

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isSupabaseConfigured) {
    alert("Supabase is not configured. Please set up your environment variables to manage products.");
    return;
  }

  let finalImageUrl = formData.imageUrl;

  // Handle image upload if file is selected
  if (formData.imageFile) {
    try {
      finalImageUrl = await uploadImageToSupabase(formData.imageFile);
    } catch (error) {
      alert(`Image upload failed: ${error.message}`);
      return;
    }
  }

  // Validate required fields
  if (!finalImageUrl) {
    alert("Please provide an image file or URL.");
    return;
  }

  // Determine the final category
  let finalCategory = formData.category;
  if (formData.category === "custom" && customCategory.trim()) {
    finalCategory = customCategory.trim();
  }

  if (!finalCategory) {
    alert("Please select or enter a category.");
    return;
  }
  
  const productData = {
    name: formData.name,
    slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: finalCategory,
    price: parseFloat(formData.price),
    description: formData.description,
    features: formData.features.split('\n').filter(f => f.trim()),
    imageUrl: finalImageUrl,
    inStock: formData.inStock,
    isFeatured: formData.isFeatured,
  };

  try {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, productData);
      
      if (updated) {
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        alert('Product updated successfully!');
        setIsDialogOpen(false);
        resetForm();
      } else {
        alert('Failed to update product. Please check your connection.');
      }
    } else {
      const created = await createProduct(productData);
      if (created) {
        setProducts([created, ...products]);
        alert('Product created successfully!');
        setIsDialogOpen(false);
        resetForm();
      } else {
        alert('Failed to create product. Please try again.');
      }
    }

    // Reload categories in case a new one was added
    const updatedCategories = await getProductCategories();
    setCategories(updatedCategories);
  } catch (error) {
    let errorMessage = 'Unknown error occurred';
    
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    alert(`Error saving product: ${errorMessage}`);
  }
};
```

### D. Supabase Storage Setup

**Required Storage Bucket Setup**:
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `product-images`
3. Set it to public
4. Add this RLS policy:

```sql
-- Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

## Testing Checklist

### Cart Functionality
- [ ] Add item to cart from product card
- [ ] Add item to cart from product page
- [ ] Remove item from cart
- [ ] Cart persists after page refresh
- [ ] Cart count updates in header
- [ ] WhatsApp message generates correctly

### Price Updates
- [ ] Update product price in admin
- [ ] Price validation works
- [ ] Error messages are clear
- [ ] Database updates correctly

### Image Upload
- [ ] File validation works (type, size)
- [ ] Upload progress shows
- [ ] Image preview displays
- [ ] Uploaded images are accessible
- [ ] Fallback to URL input works

## Common Issues & Solutions

### Issue: Cart not updating
**Solution**: Check browser console for errors, verify localStorage permissions

### Issue: Price update fails
**Solution**: Ensure product ID is valid, check Supabase connection

### Issue: Image upload fails
**Solution**: Verify Supabase storage bucket exists and has correct policies

### Issue: Hydration errors
**Solution**: Ensure client-side only code is properly guarded with `typeof window !== 'undefined'`

This guide should help you debug and enhance the cart system effectively. Let me know if you need clarification on any specific section!