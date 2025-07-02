"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Database, Upload, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllProducts, createProduct, updateProduct, deleteProduct, formatPrice, getProductCategories, uploadProductImage } from "@/lib/db";
import { Product } from "@/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { MultiImageUpload } from "@/components/products/MultiImageUpload";

function AdminPageContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  
  // Enhanced image states for multiple images
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    features: "",
    inStock: true,
    isFeatured: false,
  });

  useEffect(() => {
    // Check if Supabase is configured by checking environment variables
    const checkSupabaseConfig = () => {
      if (typeof window !== 'undefined') {
        // Check if the environment variables exist and are not empty
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        return !!(supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '' && supabaseUrl.includes('supabase.co'));
      }
      return false;
    };
    
    setIsSupabaseConfigured(checkSupabaseConfig());
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getProductCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      // Silent error handling - just use empty arrays
      setProducts([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      features: "",
      inStock: true,
      isFeatured: false,
    });
    setEditingProduct(null);
    setCustomCategory("");
    setProductImages([]);
    setIsUploading(false);
  };

  const handleEdit = (product: Product) => {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your environment variables to edit products.");
      return;
    }
    
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      features: product.features.join("\n"),
      inStock: product.inStock,
      isFeatured: product.isFeatured,
    });
    setCustomCategory("");
    // Convert single image URL to array for editing
    setProductImages(product.imageUrl ? [product.imageUrl] : []);
    setIsDialogOpen(true);
  };

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

    // Validate images
    if (productImages.length === 0) {
      alert("Please add at least one product image.");
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
      price: priceValue,
      description: formData.description,
      features: formData.features.split('\n').filter(f => f.trim()),
      imageUrl: productImages[0], // Use first image as primary
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,
    };

    try {
      if (editingProduct) {
        console.log('🔄 Updating product:', editingProduct.id);
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
        console.log('🔄 Creating new product');
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
      
      console.error('❌ Product save error:', error);
      alert(`Error saving product: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your environment variables to delete products.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        console.log('🗑️ Deleting product:', id);
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted successfully!');
      } catch (error) {
        let errorMessage = 'Unknown error occurred';
        if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String(error.message);
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        console.error('❌ Delete error:', error);
        alert('Error deleting product: ' + errorMessage);
      }
    }
  };

  const openAddDialog = () => {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your environment variables to add products.");
      return;
    }
    
    resetForm();
    setIsDialogOpen(true);
  };

  const handleCategoryChange = (value: string) => {
    setFormData({...formData, category: value});
    if (value !== "custom") {
      setCustomCategory("");
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!isSupabaseConfigured && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Supabase Setup Required:</strong> You're viewing sample data. To manage products and enable full functionality, please:
            <br />
            <span className="mt-2 block">
              1. Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">supabase.com</a>
              <br />
              2. Add your credentials to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code>
              <br />
              3. Restart your development server
            </span>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Product Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {isSupabaseConfigured ? "Manage your furniture inventory" : "Viewing sample data - Configure Supabase to manage products"}
          </p>
          {user && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Signed in as: {user.email}
            </p>
          )}
        </div>
        
        <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700" disabled={!isSupabaseConfigured}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Product Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (NGN)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">+ Add Custom Category</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.category === "custom" && (
                    <Input
                      className="mt-2"
                      placeholder="Enter custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                    />
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    rows={4}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => setFormData({...formData, inStock: checked})}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                </div>
              </div>

              {/* Right Column - Images */}
              <div>
                <MultiImageUpload
                  images={productImages}
                  onImagesChange={setProductImages}
                  maxImages={5}
                  disabled={isUploading}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDialogClose(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUploading || productImages.length === 0}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    {editingProduct ? "Update" : "Create"} Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Products Grid with Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.map((product) => {
          // Convert single image URL to array for gallery component
          const images = [product.imageUrl];
          
          return (
            <Card key={product.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48">
                <ProductImageGallery
                  images={images}
                  productName={product.name}
                  className="w-full h-full"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.isFeatured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Featured
                    </Badge>
                  )}
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                  <span className="font-semibold">{formatPrice(product.price)}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    disabled={!isSupabaseConfigured}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={!isSupabaseConfigured}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700" disabled={!isSupabaseConfigured}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  );
}