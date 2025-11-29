"use client";

import { useEffect, useState } from "react";
import { getAllProducts, updateProduct, getProductBySlug, createProduct, deleteProduct, getProductCategories, uploadProductImage } from "@/lib/products";
import { getAllSpaces } from "@/lib/categories";
import { Product, Space, Subcategory } from "@/types";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Crop } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { MultiImageUpload } from "@/components/products/MultiImageUpload";
import { EnhancedMediaUpload } from "@/components/products/EnhancedMediaUpload";
import { Badge } from "@/components/ui/badge";
import { WarehouseSelector } from "@/components/ui/warehouse-selector";
import MultiWarehouseStockEditor from "@/components/admin/MultiWarehouseStockEditor";
import { getAllWarehouses } from "@/lib/warehouses";
import { Warehouse } from "@/types";
import { ImageCropper } from "@/components/ui/image-cropper";
import { triggerProductRevalidation } from "@/app/actions/revalidate";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productVideos, setProductVideos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [initialStock, setInitialStock] = useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
  const [cropExistingImage, setCropExistingImage] = useState<{ index: number; url: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    features: "",
    inStock: true,
    isFeatured: false,
    discount_percent: "0",
    is_promo: false,
    is_best_seller: false,
    is_new: false,
    modelNo: "",
    warehouseLocation: "",
    dimensions: "",
    // New category system
    space_id: "",
    subcategory_id: "",
    product_type: "" as string | undefined,
    // Featured deals system
    is_featured_deal: false,
    deal_position: "",
    deal_priority: "1",
    // Enhanced product view page fields
    discount_enabled: false,
    bulk_pricing_enabled: false,
    bulk_pricing_tiers: "",
    ships_from: "",
    popular_with: "",
    badges: "",
    materials: "",
    weight_capacity: "",
    warranty: "",
    delivery_timeframe: "",
    stock_count: "",
    limited_time_deal_enabled: false,
    limited_time_deal_end_date: "",
    limited_time_deal_discount_percent: "0",
  });

  const fetchProducts = async () => {
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
      setAllWarehouses(warehousesData.map(w => ({ id: w.id, name: w.name })) as Warehouse[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products based on search term and sort option
  useEffect(() => {
    let filtered = products;

    if (searchTerm.trim()) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product as any).modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, products, sortBy]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      features: "",
      inStock: true,
      isFeatured: false,
      discount_percent: "0",
      is_promo: false,
      is_best_seller: false,
      is_new: false,
      modelNo: "",
      warehouseLocation: "",
      dimensions: "",
      // New category system
      space_id: "",
      subcategory_id: "",
      product_type: "",
      // Featured deals system
      is_featured_deal: false,
      deal_position: "",
      deal_priority: "1",
      // Enhanced product view page fields
      discount_enabled: false,
      bulk_pricing_enabled: false,
      bulk_pricing_tiers: "",
      ships_from: "",
      popular_with: "",
      badges: "",
      materials: "",
      weight_capacity: "",
      warranty: "",
      delivery_timeframe: "",
      stock_count: "",
      limited_time_deal_enabled: false,
      limited_time_deal_end_date: "",
      limited_time_deal_discount_percent: "0",
    });
    setEditingProduct(null);
    setCustomCategory("");
    setProductImages([]);
    setProductVideos([]);
    setIsUploading(false);
    setInitialStock("");
    setSelectedWarehouseId("");
  };

  const handleEdit = (product: Product) => {
    console.log('📝 Editing product:', product.name);
    console.log('DOTW values:', {
      is_featured_deal: (product as any).is_featured_deal,
      deal_priority: (product as any).deal_priority
    });
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: String((product as any).original_price ?? product.price ?? ""),
      description: product.description,
      features: product.features.join("\n"),
      inStock: product.inStock,
      isFeatured: product.isFeatured,
      discount_percent: String((product as any).discount_percent ?? 0),
      is_promo: Boolean((product as any).is_promo),
      is_best_seller: Boolean((product as any).is_best_seller),
      is_new: Boolean((product as any).is_new),
      modelNo: String((product as any).modelNo ?? ""),
      warehouseLocation: String((product as any).warehouseLocation ?? ""),
      dimensions: String((product as any).dimensions ?? ""),
      // New category system
      space_id: String((product as any).space_id ?? ""),
      subcategory_id: String((product as any).subcategory_id ?? ""),
      product_type: String((product as any).product_type ?? ""),
      // Featured deals system
      is_featured_deal: Boolean((product as any).is_featured_deal),
      deal_position: String((product as any).deal_position ?? ""),
      deal_priority: String((product as any).deal_priority ?? "1"),
      // Enhanced product view page fields
      discount_enabled: Boolean((product as any).discount_enabled),
      bulk_pricing_enabled: Boolean((product as any).bulk_pricing_enabled),
      bulk_pricing_tiers: (product as any).bulk_pricing_tiers ? JSON.stringify((product as any).bulk_pricing_tiers, null, 2) : "",
      ships_from: String((product as any).ships_from ?? ""),
      popular_with: (product as any).popular_with ? (product as any).popular_with.join(", ") : "",
      badges: (product as any).badges ? (product as any).badges.join(", ") : "",
      materials: String((product as any).materials ?? ""),
      weight_capacity: String((product as any).weight_capacity ?? ""),
      warranty: String((product as any).warranty ?? ""),
      delivery_timeframe: String((product as any).delivery_timeframe ?? ""),
      stock_count: String((product as any).stock_count ?? ""),
      limited_time_deal_enabled: Boolean((product as any).limited_time_deal?.enabled),
      limited_time_deal_end_date: (product as any).limited_time_deal?.end_date ? new Date((product as any).limited_time_deal.end_date).toISOString().split('T')[0] : "",
      limited_time_deal_discount_percent: String((product as any).limited_time_deal?.discount_percent ?? "0"),
    });
    setCustomCategory("");
    // Use the full images array if available, otherwise fallback to single imageUrl
    setProductImages(product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []));
    // Set videos if available
    setProductVideos((product as any).videos || []);

    // Set initial stock and warehouse location for editing
    setInitialStock(String((product as any).stock_count ?? ""));
    setSelectedWarehouseId(String((product as any).warehouseLocation ?? ""));

    setIsDialogOpen(true);
  };

  const handleImagesChange = (newImages: string[]) => {
    console.log('🔄 Admin: Images changed to:', newImages);
    setProductImages(newImages);
  };

  const handleCropComplete = (croppedFile: File) => {
    console.log('🔄 Admin: Crop completed, file:', croppedFile);
    // The EnhancedMediaUpload component should handle the upload automatically
  };

  const handleCropExistingImage = async (imageIndex: number) => {
    console.log('🔄 Admin: Crop existing image at index:', imageIndex);
    const imageUrl = productImages[imageIndex];
    setCropExistingImage({ index: imageIndex, url: imageUrl });
  };

  const handleExistingCropComplete = async (croppedFile: File) => {
    console.log('🔄 Admin: Uploading cropped existing image:', croppedFile.name, croppedFile.size, 'bytes');
    try {
      const croppedImageUrl = await uploadProductImage(croppedFile);
      const newImages = [...productImages];
      newImages[cropExistingImage!.index] = croppedImageUrl;
      setProductImages(newImages);
      console.log('✅ Image cropped and uploaded successfully:', croppedImageUrl);
      // Success - no alert needed, UI updates automatically
    } catch (error) {
      console.error('❌ Error uploading cropped image:', error);
      // Silent error handling - no annoying popups
    }
    setCropExistingImage(null);
  };

  const handleVideosChange = (newVideos: string[]) => {
    console.log('🔄 Admin: Videos changed to:', newVideos);
    setProductVideos(newVideos);
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
    if (value !== "custom") {
      setCustomCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // Validate Space and Subspace
    if (!formData.space_id) {
      alert("Please select a Space.");
      return;
    }
    if (!formData.subcategory_id) {
      alert("Please select a Subcategory.");
      return;
    }

    // Validate Initial Stock and Warehouse (only if provided)
    let qty = 0;
    if (initialStock) {
      qty = parseInt(initialStock);
      if (isNaN(qty) || qty < 0) {
        alert("Please enter a valid initial stock quantity.");
        return;
      }
      if (!selectedWarehouseId) {
        alert("Please select a Warehouse when setting initial stock.");
        return;
      }
    }

    // Parse bulk pricing tiers
    let bulkPricingTiers = undefined;
    if (formData.bulk_pricing_tiers.trim()) {
      try {
        bulkPricingTiers = JSON.parse(formData.bulk_pricing_tiers);
      } catch (error) {
        alert("Invalid bulk pricing tiers JSON format. Please check your input.");
        return;
      }
    }

    // Parse popular_with and badges arrays
    const popularWith = formData.popular_with.trim()
      ? formData.popular_with.split(',').map(item => item.trim()).filter(Boolean)
      : undefined;

    const badges = formData.badges.trim()
      ? formData.badges.split(',').map(item => item.trim()).filter(Boolean)
      : undefined;

    // Parse limited time deal
    const limitedTimeDeal = formData.limited_time_deal_enabled ? {
      enabled: true,
      end_date: formData.limited_time_deal_end_date,
      discount_percent: Number(formData.limited_time_deal_discount_percent) || 0
    } : undefined;

    const productData = {
      name: formData.name,
      slug: generateSlug(formData.name),
      category: finalCategory,
      price: priceValue,
      description: formData.description,
      features: formData.features.split('\n').filter(f => f.trim()),
      images: productImages,
      imageUrl: productImages[0],
      videos: productVideos,
      inStock: formData.inStock,
      isFeatured: formData.isFeatured,
      original_price: priceValue,
      discount_percent: formData.discount_percent ? Number(formData.discount_percent) : 0,
      is_promo: formData.is_promo,
      is_best_seller: formData.is_best_seller,
      is_new: formData.is_new,
      modelNo: formData.modelNo,
      warehouseLocation: selectedWarehouseId || undefined,
      dimensions: formData.dimensions,
      // New category system
      space_id: formData.space_id || undefined,
      subcategory_id: formData.subcategory_id || undefined,
      product_type: formData.product_type || undefined,
      // Enhanced product view page fields
      discount_enabled: formData.discount_enabled,
      bulk_pricing_enabled: formData.bulk_pricing_enabled,
      bulk_pricing_tiers: bulkPricingTiers,
      ships_from: formData.ships_from || undefined,
      popular_with: popularWith,
      badges: badges,
      materials: formData.materials || undefined,
      weight_capacity: formData.weight_capacity || undefined,
      warranty: formData.warranty || undefined,
      delivery_timeframe: formData.delivery_timeframe || undefined,
      stock_count: initialStock ? Number(initialStock) : undefined,
      limited_time_deal: limitedTimeDeal,
      // Deals of the Week
      is_featured_deal: formData.is_featured_deal,
      deal_priority: formData.deal_priority ? Number(formData.deal_priority) : undefined,
    };

    console.log('🔄 Submitting product data:', productData);
    console.log('📊 Featured deals values:', {
      is_featured_deal: formData.is_featured_deal,
      deal_priority: formData.deal_priority,
      deal_priority_number: formData.deal_priority ? Number(formData.deal_priority) : undefined
    });

    try {
      setSavingId(editingProduct?.id || 'new');

      // Handle DOTW position conflicts
      if (formData.is_featured_deal && formData.deal_priority) {
        const newPosition = Number(formData.deal_priority);
        console.log('🔄 Handling DOTW position conflict for position:', newPosition);

        // Get all current DOTW products
        const { data: dotwProducts } = await supabase
          .from('products')
          .select('id, name, deal_priority')
          .eq('is_featured_deal', true)
          .neq('id', editingProduct?.id || '') // Exclude current product
          .order('deal_priority', { ascending: true });

        if (dotwProducts && dotwProducts.length > 0) {
          // Check if position is taken
          const conflictingProduct = dotwProducts.find(p => p.deal_priority === newPosition);

          if (conflictingProduct) {
            console.log('⚠️ Position conflict detected, cascading products...');

            // Get all products at or after the new position
            const productsToShift = dotwProducts.filter(p => p.deal_priority >= newPosition);

            // Shift them down by 1
            for (const product of productsToShift) {
              const newPos = product.deal_priority + 1;

              if (newPos > 7) {
                // Remove from DOTW if beyond position 7
                console.log(`❌ Removing ${product.name} from DOTW (position ${newPos} > 7)`);
                await supabase
                  .from('products')
                  .update({ is_featured_deal: false, deal_priority: null })
                  .eq('id', product.id);
              } else {
                // Shift to new position
                console.log(`➡️ Moving ${product.name} from position ${product.deal_priority} to ${newPos}`);
                await supabase
                  .from('products')
                  .update({ deal_priority: newPos })
                  .eq('id', product.id);
              }
            }
          }
        }
      }

      if (editingProduct) {
        console.log('🔄 Updating product:', editingProduct.id);

        // Store old product data for revalidation (especially slug changes)
        const oldProductData = {
          id: editingProduct.id,
          slug: editingProduct.slug,
          is_featured: editingProduct.isFeatured,
          is_featured_deal: (editingProduct as any).is_featured_deal
        };

        const updated = await updateProduct(editingProduct.id, productData);

        if (updated) {
          // Only update inventory if stock and warehouse are provided
          if (initialStock && selectedWarehouseId && qty > 0) {
            try {
              await fetch('/api/inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries: [{ warehouse_id: selectedWarehouseId, product_id: updated.id, stock_count: qty }] })
              });
            } catch (e) {
              console.warn('Stock upsert failed', e);
            }
          }

          // Trigger revalidation with both old and new data for slug change handling
          await triggerProductRevalidation('UPDATE', updated, oldProductData);

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
          // Only update inventory if stock and warehouse are provided
          if (initialStock && selectedWarehouseId && qty > 0) {
            try {
              await fetch('/api/inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries: [{ warehouse_id: selectedWarehouseId, product_id: created.id, stock_count: qty }] })
              });
            } catch (e) {
              console.warn('Stock upsert failed', e);
            }
          }

          // Trigger revalidation for the new product
          await triggerProductRevalidation('INSERT', created);

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
      console.error('Error submitting product:', error);
      alert('An error occurred while saving the product. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string | number) => {
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
          setProducts(products.filter(p => p.id !== id));
          setFilteredProducts(filteredProducts.filter(p => p.id !== id));
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
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  // Define generateSlug function
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
  };

  // Define finalCategory
  const finalCategory = formData.category === "custom" && customCategory.trim()
    ? customCategory.trim()
    : formData.category;

  if (loading) return (
    <div className="text-center">Loading products...</div>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, model numbers, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
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
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" disabled={loading}>
            Refresh
          </Button>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information and media." : "Create a new product with details and images."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="modelNo">Model No</Label>
                    <Input
                      id="modelNo"
                      value={formData.modelNo}
                      onChange={(e) => setFormData({ ...formData, modelNo: e.target.value })}
                      placeholder="e.g., CH-001, TB-2024"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Original Price (NGN)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount_percent">Discount %</Label>
                    <Input
                      id="discount_percent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.discount_percent}
                      onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discounted_price">Discounted Price (NGN)</Label>
                    <Input
                      id="discounted_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={(() => {
                        const original = parseFloat(formData.price) || 0;
                        const discount = parseFloat(formData.discount_percent) || 0;
                        return discount > 0 ? Math.max(0, original * (1 - discount / 100)).toFixed(2) : original.toFixed(2);
                      })()}
                      disabled
                      className="bg-gray-50"
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

                {/* Space Selection */}
                <div>
                  <Label htmlFor="space">Space</Label>
                  <Select
                    value={formData.space_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, space_id: value, subcategory_id: "" });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a space" />
                    </SelectTrigger>
                    <SelectContent>
                      {spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory Selection */}
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory_id}
                    onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
                    disabled={!formData.space_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {spaces
                        .find(space => space.id === formData.space_id)
                        ?.subcategories?.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Type (conditional based on subcategory) */}
                {(() => {
                  const selectedSubcategory = spaces
                    .find(space => space.id === formData.space_id)
                    ?.subcategories?.find(sub => sub.id === formData.subcategory_id);

                  const subcategoryName = selectedSubcategory?.name?.toLowerCase() || "";
                  const isOfficeTables = subcategoryName.includes("office tables");
                  const isOfficeChairs = subcategoryName.includes("office chairs");

                  if (!isOfficeTables && !isOfficeChairs) return null;

                  return (
                    <div>
                      <Label htmlFor="product_type">
                        {isOfficeTables ? "Table Type" : "Chair Type"} (Optional)
                      </Label>
                      <Select
                        value={formData.product_type || "none"}
                        onValueChange={(value) => setFormData({ ...formData, product_type: value === "none" ? undefined : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${isOfficeTables ? "table" : "chair"} type`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {isOfficeTables && (
                            <>
                              <SelectItem value="Executive Tables">Executive Tables</SelectItem>
                              <SelectItem value="Electric Desks">Electric Desks</SelectItem>
                              <SelectItem value="Reception Tables">Reception Tables</SelectItem>
                              <SelectItem value="Conference Tables">Conference Tables</SelectItem>
                              <SelectItem value="Standard Tables">Standard Tables</SelectItem>
                            </>
                          )}
                          {isOfficeChairs && (
                            <>
                              <SelectItem value="Ergonomic Chairs">Ergonomic Chairs</SelectItem>
                              <SelectItem value="Mesh Chairs">Mesh Chairs</SelectItem>
                              <SelectItem value="Swivel Chairs">Swivel Chairs</SelectItem>
                              <SelectItem value="Guest Chairs">Guest Chairs</SelectItem>
                              <SelectItem value="Task Chairs">Task Chairs</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Used for filtering in the {isOfficeTables ? "Office Tables" : "Office Chairs"} section
                      </p>
                    </div>
                  );
                })()}

                {/* Initial Stock and Warehouse (optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="initial_stock">Initial Stock (optional)</Label>
                    <Input
                      id="initial_stock"
                      type="number"
                      min={0}
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <Label>Assign to Warehouse</Label>
                    <WarehouseSelector
                      value={selectedWarehouseId}
                      onValueChange={(id: string) => setSelectedWarehouseId(id)}
                    />
                  </div>
                </div>

                {/* Multi-warehouse stock editor */}
                {editingProduct && (
                  <div className="mt-4">
                    <MultiWarehouseStockEditor
                      productId={editingProduct.id}
                      productName={editingProduct.name}
                      onStockUpdate={(updates) => {
                        console.log('Stock updated:', updates);
                      }}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={4}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>

                {/* Inventory Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="e.g., 120cm x 80cm x 45cm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_promo"
                      checked={formData.is_promo}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_promo: checked })}
                    />
                    <Label htmlFor="is_promo">Promo Product</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_best_seller"
                      checked={formData.is_best_seller}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_best_seller: checked })}
                    />
                    <Label htmlFor="is_best_seller">Best Seller</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_new"
                      checked={formData.is_new}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                    />
                    <Label htmlFor="is_new">New Product</Label>
                  </div>
                </div>

                {/* Featured Deals Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Deals of the Week</h3>
                  <p className="text-sm text-gray-600 mb-4">Show this product in the "Deals of the Week" section (2 big cards + 5 normal cards = 7 total)</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured_deal"
                        checked={formData.is_featured_deal}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured_deal: checked })}
                      />
                      <Label htmlFor="is_featured_deal">Feature in Deals of the Week</Label>
                    </div>

                    {formData.is_featured_deal && (
                      <div>
                        <Label htmlFor="deal_priority">Position (1-7)</Label>
                        <Input
                          id="deal_priority"
                          type="number"
                          min="1"
                          max="7"
                          value={formData.deal_priority}
                          onChange={(e) => setFormData({ ...formData, deal_priority: e.target.value })}
                          placeholder="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">1-2 = big cards, 3-7 = normal cards</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Product Features */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Enhanced Product Features</h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="discount_enabled"
                        checked={formData.discount_enabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, discount_enabled: checked })}
                      />
                      <Label htmlFor="discount_enabled">Discount Enabled</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bulk_pricing_enabled"
                        checked={formData.bulk_pricing_enabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, bulk_pricing_enabled: checked })}
                      />
                      <Label htmlFor="bulk_pricing_enabled">Bulk Pricing Enabled</Label>
                    </div>
                  </div>

                  {formData.bulk_pricing_enabled && (
                    <div className="mb-4">
                      <Label htmlFor="bulk_pricing_tiers">Bulk Pricing Tiers (JSON)</Label>
                      <Textarea
                        id="bulk_pricing_tiers"
                        value={formData.bulk_pricing_tiers}
                        onChange={(e) => setFormData({ ...formData, bulk_pricing_tiers: e.target.value })}
                        rows={4}
                        placeholder='[{"min_quantity": 10, "max_quantity": 49, "price": 45000, "discount_percent": 5}, {"min_quantity": 50, "price": 40000, "discount_percent": 10}]'
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        JSON format: min_quantity, max_quantity (optional), price, discount_percent (optional)
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="ships_from">Ships From</Label>
                      <Select
                        value={formData.ships_from}
                        onValueChange={(value) => setFormData({ ...formData, ships_from: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lagos">Lagos</SelectItem>
                          <SelectItem value="Abuja">Abuja</SelectItem>
                          <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                          <SelectItem value="Kano">Kano</SelectItem>
                          <SelectItem value="Ibadan">Ibadan</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stock_count">Stock Count</Label>
                      <Input
                        id="stock_count"
                        type="number"
                        min="0"
                        value={formData.stock_count}
                        onChange={(e) => setFormData({ ...formData, stock_count: e.target.value })}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="popular_with">Popular With (comma-separated)</Label>
                      <Input
                        id="popular_with"
                        value={formData.popular_with}
                        onChange={(e) => setFormData({ ...formData, popular_with: e.target.value })}
                        placeholder="Schools, Offices, Hotels, Lounges"
                      />
                    </div>

                    <div>
                      <Label htmlFor="badges">Badges (comma-separated)</Label>
                      <Input
                        id="badges"
                        value={formData.badges}
                        onChange={(e) => setFormData({ ...formData, badges: e.target.value })}
                        placeholder="Best Seller, New Arrival, Limited Stock"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="materials">Materials</Label>
                      <Input
                        id="materials"
                        value={formData.materials}
                        onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                        placeholder="e.g., Solid Wood, Metal Frame, Leather"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight_capacity">Weight Capacity</Label>
                      <Input
                        id="weight_capacity"
                        value={formData.weight_capacity}
                        onChange={(e) => setFormData({ ...formData, weight_capacity: e.target.value })}
                        placeholder="e.g., 150kg, 200lbs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        value={formData.warranty}
                        onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                        placeholder="e.g., 2 years, 1 year parts & labor"
                      />
                    </div>

                    <div>
                      <Label htmlFor="delivery_timeframe">Delivery Timeframe</Label>
                      <Input
                        id="delivery_timeframe"
                        value={formData.delivery_timeframe}
                        onChange={(e) => setFormData({ ...formData, delivery_timeframe: e.target.value })}
                        placeholder="e.g., 2-3 business days, Same day"
                      />
                    </div>
                  </div>

                  {/* Limited Time Deal */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        id="limited_time_deal_enabled"
                        checked={formData.limited_time_deal_enabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, limited_time_deal_enabled: checked })}
                      />
                      <Label htmlFor="limited_time_deal_enabled">Limited Time Deal</Label>
                    </div>

                    {formData.limited_time_deal_enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="limited_time_deal_end_date">End Date</Label>
                          <Input
                            id="limited_time_deal_end_date"
                            type="date"
                            value={formData.limited_time_deal_end_date}
                            onChange={(e) => setFormData({ ...formData, limited_time_deal_end_date: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="limited_time_deal_discount_percent">Deal Discount %</Label>
                          <Input
                            id="limited_time_deal_discount_percent"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.limited_time_deal_discount_percent}
                            onChange={(e) => setFormData({ ...formData, limited_time_deal_discount_percent: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Media */}
              <div className="space-y-4">
                <EnhancedMediaUpload
                  images={productImages}
                  onImagesChange={handleImagesChange}
                  videos={productVideos}
                  onVideosChange={handleVideosChange}
                  maxImages={8}
                  maxVideos={3}
                  disabled={isUploading}
                  enableCropping={true}
                  onCropExisting={handleCropExistingImage}
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
                disabled={isUploading || productImages.length === 0 || savingId !== null}
              >
                {savingId !== null ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {editingProduct ? "Updating..." : "Creating..."}
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
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

                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm ? `No products found matching "${searchTerm}"` : "No products available"}
          </p>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}

      {/* Existing Image Cropping - Nested Dialog */}
      <Dialog open={!!cropExistingImage} onOpenChange={() => setCropExistingImage(null)}>
        <DialogContent className="!w-[95vw] !h-[95vh] !max-w-[95vw] !max-h-[95vh] p-0">
          {cropExistingImage && (
            <ImageCropper
              imageUrl={cropExistingImage.url}
              onCropComplete={handleExistingCropComplete}
              onCancel={() => setCropExistingImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
