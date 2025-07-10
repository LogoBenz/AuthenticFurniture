# Authentic Furniture - Quick Reference Guide

## 🚀 Getting Started

### Essential Imports
```typescript
// Core types
import { Product, Customer, Order } from '@/types';

// Product management
import { getAllProducts, getProductBySlug, formatPrice } from '@/lib/products';

// Hooks
import { useAuth } from '@/hooks/use-auth';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Utilities
import { cn } from '@/lib/utils';
```

## 📦 Product Management

### Fetch Products
```typescript
// Get all products
const products = await getAllProducts();

// Get single product
const product = await getProductBySlug('product-slug');

// Get featured products
const featured = await getFeaturedProducts();

// Get by category
const officeChairs = await getProductsByCategory('Office Chairs');

// Get categories
const categories = await getProductCategories();
```

### Product CRUD Operations
```typescript
// Create product
const newProduct = await createProduct({
  name: 'New Chair',
  slug: 'new-chair',
  category: 'Office Chairs',
  price: 75000,
  description: 'Comfortable chair',
  features: ['Ergonomic', 'Adjustable'],
  imageUrl: 'https://example.com/image.jpg',
  inStock: true,
  isFeatured: false
});

// Update product
const updated = await updateProduct(1, { price: 80000, inStock: false });

// Delete product
const success = await deleteProduct(1);
```

### Format Price
```typescript
const formatted = formatPrice(150000); // "₦150,000"
```

## 🛒 Enquiry Cart

### Basic Usage
```typescript
function ProductComponent({ product }) {
  const { addToCart, removeFromCart, isInCart, getCartCount } = useEnquiryCart();

  return (
    <div>
      <p>Items in cart: {getCartCount()}</p>
      {isInCart(product.id) ? (
        <Button onClick={() => removeFromCart(product.id)}>Remove</Button>
      ) : (
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      )}
    </div>
  );
}
```

### Generate WhatsApp Message
```typescript
const { generateWhatsAppMessage } = useEnquiryCart();
const message = generateWhatsAppMessage();
// Opens WhatsApp with pre-filled message
```

## 🔐 Authentication

### Check Auth Status
```typescript
function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user?.email}</div>;
}
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut();
```

## 🔔 Toast Notifications

### Show Notifications
```typescript
function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Operation completed successfully.",
    });
  };

  const handleError = () => {
    toast({
      title: "Error!",
      description: "Something went wrong.",
      variant: "destructive",
    });
  };
}
```

## 🎨 UI Components

### Button Variants
```typescript
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes
```typescript
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### Card Layout
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog/Modal
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    <p>Modal content</p>
  </DialogContent>
</Dialog>
```

## 📱 Product Components

### Product Card
```typescript
<ProductCard product={product} />
```

### Product Grid
```typescript
<ProductGrid products={products} />
```

### Product Filters
```typescript
<ProductFilters 
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

### Enquiry Cart Modal
```typescript
<EnquiryCartModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

## 🎯 Common Patterns

### Loading States
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);

if (loading) return <div>Loading...</div>;
```

### Error Handling with Toast
```typescript
const { toast } = useToast();

try {
  const result = await someAsyncOperation();
  toast({
    title: "Success",
    description: "Operation completed",
  });
} catch (error) {
  toast({
    title: "Error",
    description: "Something went wrong",
    variant: "destructive",
  });
}
```

### Conditional Rendering
```typescript
{isInCart(product.id) ? (
  <Button variant="destructive" onClick={() => removeFromCart(product.id)}>
    Remove from Cart
  </Button>
) : (
  <Button onClick={() => addToCart(product)}>
    Add to Cart
  </Button>
)}
```

### Responsive Design
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## 🔧 Utility Functions

### Class Name Utility
```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  'another-class'
);
```

### Supabase Client
```typescript
import { supabase } from '@/lib/supabase';

// Query data
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'Office Chairs');
```

## 📋 TypeScript Types

### Core Types
```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  inStock: boolean;
  isFeatured: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  // ... more fields
}

interface Order {
  id: string;
  customerId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  // ... more fields
}
```

## 🚨 Error Handling

### Network Fallback
The application automatically falls back to local data when Supabase is unavailable.

### Validation
```typescript
// Form validation with Zod
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  price: z.number().positive("Price must be positive"),
});
```

## 🔒 Security

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Authentication
- Uses Supabase Auth
- Row Level Security (RLS) enabled
- Protected routes with `useAuth` hook

## 📱 Responsive Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## 🎨 Theme Support

### Dark/Light Mode
```typescript
import { ThemeProvider } from '@/components/layout/ThemeProvider';

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### CSS Variables
```css
/* Light theme */
--background: #ffffff
--foreground: #171717
--primary: #0f172a
--primary-foreground: #f8fafc

/* Dark theme */
--background: #0a0a0a
--foreground: #ededed
--primary: #f8fafc
--primary-foreground: #0f172a
```

## 📊 Performance Tips

1. **Use Next.js Image component** for optimized images
2. **Implement loading states** for better UX
3. **Use React.memo** for expensive components
4. **Lazy load** non-critical components
5. **Cache data** in localStorage when appropriate

## 🐛 Debugging

### Console Logging
```typescript
// Product cart debugging
console.log('🛒 Cart action:', { productId, isInCart, isLoaded });

// Supabase debugging
console.log('🔗 Supabase response:', { data, error });
```

### Common Issues
1. **Hydration errors**: Check for client/server mismatch
2. **CORS errors**: Verify Supabase configuration
3. **Cart persistence**: Check localStorage availability
4. **Image loading**: Verify image URLs and Next.js config

---

## 📞 Support

For additional help:
- Check the full [API Documentation](./API_DOCUMENTATION.md)
- Review the codebase in `src/` and `components/`
- Check environment variable configuration
- Verify Supabase setup and permissions