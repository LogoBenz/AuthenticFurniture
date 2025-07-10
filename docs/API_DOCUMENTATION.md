# Authentic Furniture - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Types & Interfaces](#types--interfaces)
3. [Utility Functions](#utility-functions)
4. [Database & Supabase](#database--supabase)
5. [Product Management](#product-management)
6. [Authentication](#authentication)
7. [Custom Hooks](#custom-hooks)
8. [UI Components](#ui-components)
9. [Layout Components](#layout-components)
10. [Product Components](#product-components)
11. [Admin Components](#admin-components)

## Overview

Authentic Furniture is a Next.js/React application for managing a furniture business in Nigeria. The application provides both customer-facing features (product browsing, enquiry cart) and admin functionality (inventory management, customer management, order processing).

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context, Custom Hooks
- **Form Handling**: React Hook Form with Zod validation

---

## Types & Interfaces

### Core Data Types

#### Product
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
```

#### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  customerType: 'retail' | 'bulk' | 'corporate';
  registrationDate: string;
  lastOrderDate: string | null;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  preferredPaymentMethod: string;
  notes: string | null;
  status: 'active' | 'inactive' | 'vip';
  communicationHistory: Array<{
    date: string;
    type: 'call' | 'email' | 'whatsapp' | 'visit';
    subject: string;
    notes: string;
  }>;
}
```

#### Order
```typescript
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod: 'bank_transfer' | 'mobile_money' | 'installment' | 'cash_on_delivery';
  deliveryAddress: string;
  deliveryZone: string;
  orderDate: string;
  expectedDelivery: string | null;
  notes: string | null;
}
```

#### DeliveryZone
```typescript
interface DeliveryZone {
  id: string;
  name: string;
  areas: string[];
  basePrice: number;
  estimatedDays: string;
  isActive: boolean;
  restrictions: string[];
}
```

#### Driver
```typescript
interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  status: 'available' | 'busy' | 'offline';
  currentZone: string;
  deliveriesToday: number;
  rating: number;
}
```

#### Campaign
```typescript
interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  audience: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  startDate: string;
  endDate: string;
  budget: number;
  revenue: number;
}
```

---

## Utility Functions

### `cn()` - Class Name Utility
**Location**: `lib/utils.ts`

Combines class names using `clsx` and `tailwind-merge` for optimal Tailwind CSS class handling.

```typescript
import { cn } from '@/lib/utils';

// Usage
const className = cn(
  'base-class',
  condition && 'conditional-class',
  'another-class'
);
```

**Parameters**:
- `...inputs: ClassValue[]` - Variable number of class values

**Returns**: `string` - Merged and optimized class string

---

## Database & Supabase

### Supabase Client
**Location**: `lib/supabase.ts`

Provides Supabase client with fallback handling for when Supabase is not configured.

```typescript
import { supabase, createAdminClient } from '@/lib/supabase';

// Regular client (for client-side operations)
const { data, error } = await supabase
  .from('products')
  .select('*');

// Admin client (for server-side operations)
const adminClient = createAdminClient();
```

**Exports**:
- `supabase` - Main Supabase client with fallback
- `createAdminClient()` - Function to create admin client for server operations

**Features**:
- Automatic fallback to dummy client when Supabase is not configured
- Enhanced error handling for network issues
- CORS handling
- 30-second timeout for requests

---

## Product Management

### Product API Functions
**Location**: `lib/products.ts`

#### `getAllProducts()`
Retrieves all products from the database with fallback to local data.

```typescript
import { getAllProducts } from '@/lib/products';

const products = await getAllProducts();
```

**Returns**: `Promise<Product[]>` - Array of all products

#### `getProductBySlug(slug: string)`
Retrieves a single product by its slug.

```typescript
import { getProductBySlug } from '@/lib/products';

const product = await getProductBySlug('ergonomic-office-chair');
```

**Parameters**:
- `slug: string` - Product slug identifier

**Returns**: `Promise<Product | null>` - Product or null if not found

#### `getFeaturedProducts()`
Retrieves only featured products.

```typescript
import { getFeaturedProducts } from '@/lib/products';

const featuredProducts = await getFeaturedProducts();
```

**Returns**: `Promise<Product[]>` - Array of featured products

#### `getProductCategories()`
Retrieves all unique product categories.

```typescript
import { getProductCategories } from '@/lib/products';

const categories = await getProductCategories();
// Returns: ['Office Chairs', 'Sofas', 'Tables', ...]
```

**Returns**: `Promise<string[]>` - Array of category names

#### `getProductsByCategory(category: string)`
Retrieves products filtered by category.

```typescript
import { getProductsByCategory } from '@/lib/products';

const officeChairs = await getProductsByCategory('Office Chairs');
```

**Parameters**:
- `category: string` - Category name to filter by

**Returns**: `Promise<Product[]>` - Array of products in the category

#### `formatPrice(price: number)`
Formats price in Nigerian Naira format.

```typescript
import { formatPrice } from '@/lib/products';

const formattedPrice = formatPrice(150000);
// Returns: "₦150,000"
```

**Parameters**:
- `price: number` - Price in Naira

**Returns**: `string` - Formatted price string

#### `createProduct(product: Omit<Product, 'id'>)`
Creates a new product in the database.

```typescript
import { createProduct } from '@/lib/products';

const newProduct = await createProduct({
  name: 'New Office Chair',
  slug: 'new-office-chair',
  category: 'Office Chairs',
  price: 75000,
  description: 'Comfortable office chair',
  features: ['Ergonomic', 'Adjustable'],
  imageUrl: 'https://example.com/image.jpg',
  inStock: true,
  isFeatured: false
});
```

**Parameters**:
- `product: Omit<Product, 'id'>` - Product data without ID

**Returns**: `Promise<Product | null>` - Created product or null on error

#### `updateProduct(id: number, updates: Partial<Product>)`
Updates an existing product.

```typescript
import { updateProduct } from '@/lib/products';

const updatedProduct = await updateProduct(1, {
  price: 80000,
  inStock: false
});
```

**Parameters**:
- `id: number` - Product ID
- `updates: Partial<Product>` - Partial product data to update

**Returns**: `Promise<Product | null>` - Updated product or null on error

#### `deleteProduct(id: number)`
Deletes a product from the database.

```typescript
import { deleteProduct } from '@/lib/products';

const success = await deleteProduct(1);
```

**Parameters**:
- `id: number` - Product ID to delete

**Returns**: `Promise<boolean>` - Success status

#### `uploadProductImage(file: File)`
Uploads a product image to Supabase storage.

```typescript
import { uploadProductImage } from '@/lib/products';

const imageUrl = await uploadProductImage(fileInput.files[0]);
```

**Parameters**:
- `file: File` - Image file to upload

**Returns**: `Promise<string>` - Public URL of uploaded image

---

## Authentication

### useAuth Hook
**Location**: `hooks/use-auth.ts`

Provides authentication state and methods throughout the application.

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, session, loading, signOut, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

**Returns**:
- `user: User | null` - Current user object
- `session: Session | null` - Current session
- `loading: boolean` - Loading state
- `signOut: () => Promise<void>` - Sign out function
- `isAuthenticated: boolean` - Authentication status

---

## Custom Hooks

### useEnquiryCart Hook
**Location**: `hooks/use-enquiry-cart.ts`

Manages the enquiry cart state for products customers want to inquire about.

```typescript
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';

function ProductComponent({ product }) {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    isInCart, 
    getCartCount,
    generateWhatsAppMessage 
  } = useEnquiryCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div>
      <p>Cart items: {getCartCount()}</p>
      {isInCart(product.id) ? (
        <button onClick={handleRemoveFromCart}>Remove from Cart</button>
      ) : (
        <button onClick={handleAddToCart}>Add to Cart</button>
      )}
    </div>
  );
}
```

**Returns**:
- `cartItems: EnquiryCartItem[]` - Array of items in cart
- `addToCart: (product: Product) => boolean` - Add product to cart
- `removeFromCart: (productId: number) => boolean` - Remove product from cart
- `clearCart: () => void` - Clear all items from cart
- `isInCart: (productId: number) => boolean` - Check if product is in cart
- `getCartCount: () => number` - Get total number of items in cart
- `generateWhatsAppMessage: () => string` - Generate WhatsApp message with cart items
- `isLoaded: boolean` - Whether cart has been loaded from localStorage

### useToast Hook
**Location**: `hooks/use-toast.ts`

Provides toast notification functionality.

```typescript
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Operation completed successfully.",
      variant: "default",
    });
  };

  const handleError = () => {
    toast({
      title: "Error!",
      description: "Something went wrong.",
      variant: "destructive",
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

**Returns**:
- `toast: (props: ToastProps) => Toast` - Function to show toast
- `dismiss: (toastId?: string) => void` - Function to dismiss toast
- `toasts: ToasterToast[]` - Array of active toasts

---

## UI Components

### Button Component
**Location**: `components/ui/button.tsx`

Versatile button component with multiple variants and sizes.

```typescript
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// With asChild prop for custom elements
<Button asChild>
  <Link href="/products">Products</Link>
</Button>
```

**Props**:
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
- `size?: 'default' | 'sm' | 'lg' | 'icon'`
- `asChild?: boolean` - Render as child component
- All standard button HTML attributes

### Card Components
**Location**: `components/ui/card.tsx`

Card layout components for content organization.

```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Product Title</CardTitle>
    <CardDescription>Product description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Product content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Components**:
- `Card` - Main card container
- `CardHeader` - Header section with padding
- `CardTitle` - Card title (h3 element)
- `CardDescription` - Card description text
- `CardContent` - Main content area
- `CardFooter` - Footer section with padding

### Dialog Component
**Location**: `components/ui/dialog.tsx`

Modal dialog component for overlays and popups.

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>
```

**Components**:
- `Dialog` - Root dialog component
- `DialogTrigger` - Element that triggers the dialog
- `DialogContent` - Dialog content container
- `DialogHeader` - Dialog header section
- `DialogTitle` - Dialog title
- `DialogDescription` - Dialog description

### Form Components
**Location**: `components/ui/form.tsx`

Form components with React Hook Form integration.

```typescript
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const form = useForm({
  defaultValues: {
    name: '',
    email: '',
  },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter your name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

**Components**:
- `Form` - Form wrapper with React Hook Form context
- `FormField` - Individual form field wrapper
- `FormItem` - Form item container
- `FormLabel` - Form label
- `FormControl` - Form control wrapper
- `FormMessage` - Form validation message

### Toast Components
**Location**: `components/ui/toast.tsx`

Toast notification components.

```typescript
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { toast } = useToast();

  return (
    <div>
      <button onClick={() => toast({
        title: "Success",
        description: "Operation completed",
      })}>
        Show Toast
      </button>
      <Toaster />
    </div>
  );
}
```

**Components**:
- `Toast` - Individual toast component
- `ToastAction` - Toast action button
- `ToastClose` - Toast close button
- `ToastDescription` - Toast description
- `ToastProvider` - Toast context provider
- `ToastTitle` - Toast title
- `ToastViewport` - Toast viewport container
- `Toaster` - Toast container component

---

## Layout Components

### Header Component
**Location**: `components/layout/Header.tsx`

Main application header with navigation and cart indicator.

```typescript
import { Header } from '@/components/layout/Header';

// Used in layout
<Header />
```

**Features**:
- Responsive navigation menu
- Cart indicator with item count
- Theme toggle
- Mobile menu
- Search functionality

### Footer Component
**Location**: `components/layout/Footer.tsx`

Application footer with links and company information.

```typescript
import { Footer } from '@/components/layout/Footer';

// Used in layout
<Footer />
```

**Features**:
- Company information
- Quick links
- Contact information
- Social media links

### ThemeProvider Component
**Location**: `components/layout/ThemeProvider.tsx`

Provides theme context for dark/light mode switching.

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

**Props**:
- `attribute?: string` - HTML attribute for theme class
- `defaultTheme?: string` - Default theme
- `enableSystem?: boolean` - Enable system theme detection
- `disableTransitionOnChange?: boolean` - Disable transitions on theme change

---

## Product Components

### ProductCard Component
**Location**: `components/products/ProductCard.tsx`

Displays individual product information with cart functionality.

```typescript
import { ProductCard } from '@/components/products/ProductCard';

<ProductCard product={product} />
```

**Props**:
- `product: Product` - Product data to display

**Features**:
- Product image with hover effects
- Product information (name, category, price)
- Add/remove from enquiry cart functionality
- Stock status indicator
- Quick add overlay on hover
- Responsive design

### ProductGrid Component
**Location**: `components/products/ProductGrid.tsx`

Grid layout for displaying multiple products.

```typescript
import { ProductGrid } from '@/components/products/ProductGrid';

<ProductGrid products={products} />
```

**Props**:
- `products: Product[]` - Array of products to display

### ProductFilters Component
**Location**: `components/products/ProductFilters.tsx`

Filtering interface for products.

```typescript
import { ProductFilters } from '@/components/products/ProductFilters';

<ProductFilters 
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

**Props**:
- `categories: string[]` - Available categories
- `selectedCategory: string` - Currently selected category
- `onCategoryChange: (category: string) => void` - Category change handler

### ProductImageGallery Component
**Location**: `components/products/ProductImageGallery.tsx`

Image gallery for product detail pages.

```typescript
import { ProductImageGallery } from '@/components/products/ProductImageGallery';

<ProductImageGallery images={productImages} />
```

**Props**:
- `images: string[]` - Array of image URLs

**Features**:
- Image carousel
- Thumbnail navigation
- Zoom functionality
- Responsive design

### EnquiryCartModal Component
**Location**: `components/products/EnquiryCartModal.tsx`

Modal for viewing and managing enquiry cart.

```typescript
import { EnquiryCartModal } from '@/components/products/EnquiryCartModal';

<EnquiryCartModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**Props**:
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close handler

**Features**:
- Cart item list
- Remove items functionality
- WhatsApp message generation
- Clear cart functionality

### FeaturedProducts Component
**Location**: `components/products/FeaturedProducts.tsx`

Displays featured products section.

```typescript
import { FeaturedProducts } from '@/components/products/FeaturedProducts';

<FeaturedProducts />
```

**Features**:
- Fetches featured products automatically
- Responsive grid layout
- Loading states
- Error handling

### FloatingEnquiryButton Component
**Location**: `components/products/FloatingEnquiryButton.tsx`

Floating button for quick access to enquiry cart.

```typescript
import { FloatingEnquiryButton } from '@/components/products/FloatingEnquiryButton';

<FloatingEnquiryButton />
```

**Features**:
- Shows cart item count
- Opens enquiry cart modal
- Floating position
- Responsive design

---

## Admin Components

### Admin Layout Components
**Location**: `components/admin/`

Admin-specific layout and navigation components.

### Customer Management Components
**Location**: `components/customers/`

Components for managing customer data and relationships.

### Inventory Management Components
**Location**: `components/inventory/`

Components for managing product inventory and stock levels.

---

## Usage Examples

### Complete Product Listing Page
```typescript
import { useState, useEffect } from 'react';
import { getAllProducts, getProductCategories } from '@/lib/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProducts, allCategories] = await Promise.all([
          getAllProducts(),
          getProductCategories()
        ]);
        setProducts(allProducts);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
```

### Product Detail Page with Cart Integration
```typescript
import { useState, useEffect } from 'react';
import { getProductBySlug } from '@/lib/products';
import { ProductCard } from '@/components/products/ProductCard';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

export default function ProductDetailPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useEnquiryCart();
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, toast]);

  const handleAddToCart = () => {
    if (product) {
      const success = addToCart(product);
      if (success) {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your enquiry cart`,
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl font-bold mb-4">{formatPrice(product.price)}</p>
          <p className="mb-6">{product.description}</p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isInCart(product.id)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isInCart(product.id) ? 'In Cart' : 'Add to Enquiry Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Admin Product Management
```typescript
import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/lib/products';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(productData);
      if (newProduct) {
        setProducts(prev => [newProduct, ...prev]);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(id, updates);
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>
      
      {/* Product creation form would go here */}
      
      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="font-bold">{formatPrice(product.price)}</p>
            
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleUpdateProduct(product.id, { inStock: !product.inStock })}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Toggle Stock
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Environment Variables

The application requires the following environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=your_app_url
```

---

## Error Handling

The application implements comprehensive error handling:

1. **Network Errors**: Automatic fallback to local data when Supabase is unavailable
2. **Authentication Errors**: Graceful handling of auth state changes
3. **Form Validation**: Client-side validation with user-friendly error messages
4. **Toast Notifications**: User feedback for all operations
5. **Loading States**: Proper loading indicators for async operations

---

## Performance Considerations

1. **Image Optimization**: Next.js Image component for optimized image loading
2. **Code Splitting**: Automatic code splitting by Next.js
3. **Lazy Loading**: Components loaded on demand
4. **Caching**: Supabase client caching and localStorage for cart persistence
5. **Fallback Data**: Local data fallback to ensure app functionality without database

---

## Security

1. **Environment Variables**: Sensitive data stored in environment variables
2. **Supabase RLS**: Row Level Security for database access control
3. **Input Validation**: Zod schema validation for all forms
4. **XSS Prevention**: Proper escaping and sanitization
5. **CORS Handling**: Proper CORS configuration for API requests

This documentation covers all public APIs, functions, and components in the Authentic Furniture application. For additional support or questions, please refer to the codebase or contact the development team.