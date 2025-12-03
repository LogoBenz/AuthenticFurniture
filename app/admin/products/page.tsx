"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { getAllProducts, deleteProduct, getProductCategories } from "@/lib/products";
import { getAllSpaces } from "@/lib/categories";
import { Product, Space } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, LayoutGrid, LayoutList } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { getAllWarehouses } from "@/lib/warehouses";
import { Warehouse } from "@/types";
import { triggerProductRevalidation } from "@/app/actions/revalidate";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, spacesData, warehousesData] = await Promise.all([
        getAllProducts(),
        getProductCategories(),
        getAllSpaces(),
        getAllWarehouses()
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
      setSpaces(spacesData);
      setAllWarehouses(warehousesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products based on search term and sort option
  useEffect(() => {
    let filtered = products;

    if (debouncedSearchTerm.trim()) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (product as any).modelNo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'category-asc':
          return a.category.localeCompare(b.category);
        case 'category-desc':
          return b.category.localeCompare(a.category);
        case 'stock-asc':
          return (a.inStock ? 1 : 0) - (b.inStock ? 1 : 0);
        case 'stock-desc':
          return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  }, [debouncedSearchTerm, products, sortBy]);

  // Handle edit query param
  const searchParams = useSearchParams();
  const router = useRouter();
  const editSlug = searchParams.get('edit');

  const handleEdit = useCallback((product: Product) => {
    console.log('📝 Editing product:', product.name);
    setEditingProduct(product);
    setIsDialogOpen(true);
  }, []);

  useEffect(() => {
    if (editSlug && products.length > 0 && !isDialogOpen) {
      const productToEdit = products.find(p => p.slug === editSlug);
      if (productToEdit) {
        handleEdit(productToEdit);
      }
    }
  }, [editSlug, products, isDialogOpen, handleEdit]);

  const resetForm = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleDelete = useCallback(async (id: string | number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        console.log('🗑️ Deleting product:', id);

        // Find the product to get its data before deletion
        const productToDelete = products.find(p => p.id === id);

        const success = await deleteProduct(id);

        if (success) {
          // Trigger revalidation with deleted product data
          if (productToDelete) {
            await triggerProductRevalidation('DELETE', {
              id: productToDelete.id,
              slug: productToDelete.slug,
              is_featured: productToDelete.isFeatured,
              is_featured_deal: (productToDelete as any).is_featured_deal
            });
          }

          // Update local state immediately
          setProducts(prev => prev.filter(p => p.id !== id));
          setFilteredProducts(prev => prev.filter(p => p.id !== id));
          alert('Product deleted successfully!');
        } else {
          throw new Error('Delete operation returned false');
        }
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
  }, [products, filteredProducts]);

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const handleDialogClose = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
      // Clear the 'edit' query param if it exists to prevent re-opening
      if (editSlug) {
        router.replace('/admin/products');
      }
    }
  }, [resetForm, editSlug, router]);



  if (loading) return (
    <div className="text-center">Loading products...</div>
  );

  return (
    <div className="p-4 pt-2 lg:p-8">
      {/* Header */}
      <div className="mb-4 space-y-3">
        {/* Title */}
        <h1 className="text-2xl font-bold">Products</h1>

        {/* Search Bar - Full Width on Mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products, model numbers, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Controls Row - All on Same Line */}
        <div className="flex items-center gap-2 justify-between">
          {/* Left Side: Refresh & Add Buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={fetchProducts} variant="outline" disabled={loading} size="icon">
              <span className="sr-only">Refresh</span>
              <span>↻</span>
            </Button>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700" size="icon">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Product</span>
            </Button>
          </div>

          {/* Center: Display Selector (Mobile Only) */}
          <div className="flex md:hidden bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setMobileColumns(1)}
              className={`p-2 rounded-md transition-all ${mobileColumns === 1 ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}
              title="Single Column"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileColumns(2)}
              className={`p-2 rounded-md transition-all ${mobileColumns === 2 ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}
              title="Two Columns"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Right Side: Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="category-asc">Category (A-Z)</SelectItem>
              <SelectItem value="category-desc">Category (Z-A)</SelectItem>
              <SelectItem value="stock-asc">Out of Stock First</SelectItem>
              <SelectItem value="stock-desc">In Stock First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Product Dialog */}
      <ProductFormDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        product={editingProduct}
        categories={categories}
        spaces={spaces}
        warehouses={allWarehouses}
        onSuccess={fetchProducts}
      />

      {/* Products Grid */}
      <div className={`grid gap-4 md:gap-6 ${mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
        {filteredProducts.map((product: any) => {
          const discount = Number(product.discount_percent || 0);
          const original = Number(product.original_price ?? product.price);
          const discounted = discount > 0 ? Math.max(0, original * (1 - discount / 100)) : original;
          const images = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);

          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-slate-50 dark:bg-slate-900">
                <Image
                  src={images[0] || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    -{discount}%
                  </div>
                )}
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

              <CardContent className={`p-3 md:p-4 ${mobileColumns === 2 ? 'text-sm' : ''}`}>
                <h3 className={`font-semibold mb-1 line-clamp-2 ${mobileColumns === 2 ? 'text-sm leading-tight' : 'text-lg'}`}>{product.name}</h3>
                {(product as any).modelNo && (
                  <p className="text-sm text-muted-foreground mb-2">Model: {(product as any).modelNo}</p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  {discount > 0 ? (
                    <>
                      <span className="text-sm line-through text-muted-foreground">
                        {formatPrice(original)}
                      </span>
                      <span className="text-lg font-semibold text-red-600">
                        {formatPrice(discounted)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold">
                      {formatPrice(original)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 text-xs text-muted-foreground mb-3">
                  {product.is_promo && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Promo</span>
                  )}
                  {product.is_best_seller && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Best Seller</span>
                  )}
                  {(product as any).is_new && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                  )}
                </div>

                {/* Additional Inventory Information */}
                {(product.dimensions) && (
                  <div className="space-y-1 mb-3 text-xs text-muted-foreground">
                    {product.dimensions && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Size:</span>
                        <span>{product.dimensions}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className={`flex justify-end space-x-2 ${mobileColumns === 2 ? 'mt-2' : ''}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className={mobileColumns === 2 ? "h-8 w-8 p-0" : ""}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className={`text-red-600 hover:text-red-700 ${mobileColumns === 2 ? "h-8 w-8 p-0" : ""}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {
        filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? `No products found matching "${searchTerm}"` : "No products available"}
            </p>
            <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )
      }

      {/* Existing Image Cropping - Nested Dialog */}

    </div >
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
