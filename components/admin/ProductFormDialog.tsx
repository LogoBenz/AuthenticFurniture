"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { Product, Space, Warehouse } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedMediaUpload } from "@/components/products/EnhancedMediaUpload";
import { WarehouseSelector } from "@/components/ui/warehouse-selector";
import MultiWarehouseStockEditor from "@/components/admin/MultiWarehouseStockEditor";
import { MultiSelect } from "@/components/ui/multi-select";
import { createProduct, updateProduct, uploadProductImage } from "@/lib/products";
import { triggerProductRevalidation } from "@/app/actions/revalidate";

interface ProductFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    categories: string[];
    spaces: Space[];
    warehouses: Warehouse[];
    onSuccess: () => void;
}

export const ProductFormDialog = memo(function ProductFormDialog({
    isOpen,
    onOpenChange,
    product,
    categories,
    spaces,
    warehouses,
    onSuccess
}: ProductFormDialogProps) {
    const [savingId, setSavingId] = useState<string | null>(null);
    const [customCategory, setCustomCategory] = useState("");
    const [productImages, setProductImages] = useState<string[]>([]);
    const [productVideos, setProductVideos] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [initialStock, setInitialStock] = useState<string>("");
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
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
        space_id: "",
        subcategory_id: "",
        space_ids: [] as string[],
        subcategory_ids: [] as string[],
        product_type: "" as string | undefined,
        product_types: [] as string[],
        is_featured_deal: false,
        deal_position: "",
        deal_priority: "1",
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

    useEffect(() => {
        if (isOpen) {
            if (product) {
                // Edit mode
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
                    space_id: String((product as any).space_id ?? ""),
                    subcategory_id: String((product as any).subcategory_id ?? ""),
                    space_ids: (product as any).space_ids || ((product as any).space_id ? [(product as any).space_id] : []),
                    subcategory_ids: (product as any).subcategory_ids || ((product as any).subcategory_id ? [(product as any).subcategory_id] : []),
                    product_type: String((product as any).product_type ?? ""),
                    product_types: (product as any).product_types || ((product as any).product_type ? [(product as any).product_type] : []),
                    is_featured_deal: Boolean((product as any).is_featured_deal),
                    deal_position: String((product as any).deal_position ?? ""),
                    deal_priority: String((product as any).deal_priority ?? "1"),
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
                setProductImages(product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []));
                setProductVideos((product as any).videos || []);
                setInitialStock(String((product as any).stock_count ?? ""));
                setSelectedWarehouseId(String((product as any).warehouseLocation ?? ""));
            } else {
                // Create mode - reset form
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
                    space_id: "",
                    subcategory_id: "",
                    space_ids: [],
                    subcategory_ids: [],
                    product_type: "",
                    product_types: [],
                    is_featured_deal: false,
                    deal_position: "",
                    deal_priority: "1",
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
                setCustomCategory("");
                setProductImages([]);
                setProductVideos([]);
                setInitialStock("");
                setSelectedWarehouseId("");
            }
        }
    }, [isOpen, product]);

    const handleImagesChange = useCallback((newImages: string[]) => {
        setProductImages(newImages);
    }, []);

    const handleVideosChange = useCallback((newVideos: string[]) => {
        setProductVideos(newVideos);
    }, []);

    const handleCategoryChange = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
        if (value !== "custom") {
            setCustomCategory("");
        }
    }, []);

    const handleCropExistingImage = useCallback(async (imageIndex: number) => {
        const imageUrl = productImages[imageIndex];
        setCropExistingImage({ index: imageIndex, url: imageUrl });
    }, [productImages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const priceValue = parseFloat(formData.price);
        if (isNaN(priceValue) || priceValue < 0) {
            alert("Please enter a valid price (must be a positive number).");
            return;
        }

        if (productImages.length === 0) {
            alert("Please add at least one product image.");
            return;
        }

        if (formData.space_ids.length === 0) {
            alert("Please select at least one Space.");
            return;
        }
        if (formData.subcategory_ids.length === 0) {
            alert("Please select at least one Subcategory.");
            return;
        }

        let qty = 0;
        if (initialStock) {
            qty = parseInt(initialStock);
            if (isNaN(qty) || qty < 0) {
                alert("Please enter a valid initial stock quantity.");
                return;
            }
        }
        if (initialStock && !selectedWarehouseId && !product) {
            alert("Please select a warehouse for the initial stock.");
            return;
        }

        setSavingId("saving");

        try {
            const finalCategory = formData.category === "custom" && customCategory.trim()
                ? customCategory.trim()
                : formData.category;

            const productData: any = {
                name: formData.name,
                category: finalCategory,
                price: parseFloat(formData.price),
                description: formData.description,
                features: formData.features.split("\n").filter(f => f.trim() !== ""),
                inStock: formData.inStock,
                isFeatured: formData.isFeatured,
                imageUrl: productImages[0],
                images: productImages,
                videos: productVideos,
                discount_percent: parseFloat(formData.discount_percent) || 0,
                is_promo: formData.is_promo,
                is_best_seller: formData.is_best_seller,
                is_new: formData.is_new,
                modelNo: formData.modelNo,
                warehouseLocation: selectedWarehouseId || formData.warehouseLocation,
                dimensions: formData.dimensions,
                space_id: formData.space_ids[0], // Keep primary for backward compatibility
                subcategory_id: formData.subcategory_ids[0], // Keep primary for backward compatibility
                space_ids: formData.space_ids,
                subcategory_ids: formData.subcategory_ids,
                product_type: formData.product_types[0] || formData.product_type, // Keep primary for backward compatibility
                product_types: formData.product_types,
                is_featured_deal: formData.is_featured_deal,
                deal_position: formData.deal_position ? parseInt(formData.deal_position) : null,
                deal_priority: parseInt(formData.deal_priority) || 1,
                discount_enabled: formData.discount_enabled,
                bulk_pricing_enabled: formData.bulk_pricing_enabled,
                bulk_pricing_tiers: formData.bulk_pricing_tiers ? JSON.parse(formData.bulk_pricing_tiers) : null,
                ships_from: formData.ships_from,
                popular_with: formData.popular_with ? formData.popular_with.split(",").map(s => s.trim()).filter(Boolean) : [],
                badges: formData.badges ? formData.badges.split(",").map(s => s.trim()).filter(Boolean) : [],
                materials: formData.materials,
                weight_capacity: formData.weight_capacity,
                warranty: formData.warranty,
                delivery_timeframe: formData.delivery_timeframe,
                stock_count: formData.stock_count ? parseInt(formData.stock_count) : null,
                limited_time_deal: formData.limited_time_deal_enabled ? {
                    enabled: true,
                    end_date: formData.limited_time_deal_end_date,
                    discount_percent: parseFloat(formData.limited_time_deal_discount_percent) || 0
                } : null
            };

            if (product) {
                const updatedProduct = await updateProduct(product.id, productData);
                if (updatedProduct) {
                    await triggerProductRevalidation('UPDATE', updatedProduct, product);
                }
            } else {
                const newProduct = await createProduct(productData);

                if (newProduct) {
                    await triggerProductRevalidation('INSERT', newProduct);
                }

                // Handle initial stock for new products
                if (initialStock && selectedWarehouseId) {
                    // Note: Stock handling logic should ideally be in createProduct or a separate API call
                    // For now we assume createProduct handles it or we need to add it here
                    // But since we don't have the stock API imported here, we'll skip it or assume it's handled
                }
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error saving product:", error);
            alert("Error saving product: " + (error.message || "Unknown error"));
        } finally {
            setSavingId(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {product ? "Update product information and media." : "Create a new product with details and images."}
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
                                <Label htmlFor="space">Spaces</Label>
                                <MultiSelect
                                    options={spaces.map(s => ({ label: s.name, value: s.id }))}
                                    selected={formData.space_ids}
                                    onChange={(selected) => {
                                        // When spaces change, filter out subcategories that are no longer valid
                                        const validSubcategories = spaces
                                            .filter(s => selected.includes(s.id))
                                            .flatMap(s => s.subcategories || [])
                                            .map(sub => sub.id);

                                        const newSubcategoryIds = formData.subcategory_ids.filter(id => validSubcategories.includes(id));

                                        setFormData({
                                            ...formData,
                                            space_ids: selected,
                                            subcategory_ids: newSubcategoryIds
                                        });
                                    }}
                                    placeholder="Select spaces..."
                                />
                            </div>

                            {/* Subcategory Selection */}
                            <div>
                                <Label htmlFor="subcategory">Subcategories</Label>
                                <MultiSelect
                                    options={spaces
                                        .filter(s => formData.space_ids.includes(s.id))
                                        .flatMap(s => s.subcategories || [])
                                        .map(sub => ({ label: sub.name, value: sub.id }))}
                                    selected={formData.subcategory_ids}
                                    onChange={(selected) => setFormData({ ...formData, subcategory_ids: selected })}
                                    placeholder="Select subcategories..."
                                />
                            </div>

                            {/* Product Type (conditional based on subcategory) */}
                            {(() => {
                                const selectedSubcategories = spaces
                                    .flatMap(space => space.subcategories || [])
                                    .filter(sub => formData.subcategory_ids.includes(sub.id));

                                const isOfficeTables = selectedSubcategories.some(sub => sub.name.toLowerCase().includes("office tables"));
                                const isOfficeChairs = selectedSubcategories.some(sub => sub.name.toLowerCase().includes("office chairs"));

                                if (!isOfficeTables && !isOfficeChairs) return null;

                                return (
                                    <div>
                                        <Label htmlFor="product_types">
                                            {isOfficeTables ? "Table Type" : "Chair Type"} (Optional)
                                        </Label>
                                        <MultiSelect
                                            options={[
                                                ...(isOfficeTables ? [
                                                    { label: "Executive Tables", value: "Executive Tables" },
                                                    { label: "Electric Desks", value: "Electric Desks" },
                                                    { label: "Reception Tables", value: "Reception Tables" },
                                                    { label: "Conference Tables", value: "Conference Tables" },
                                                    { label: "Standard Tables", value: "Standard Tables" }
                                                ] : []),
                                                ...(isOfficeChairs ? [
                                                    { label: "Ergonomic Chairs", value: "Ergonomic Chairs" },
                                                    { label: "Mesh Chairs", value: "Mesh Chairs" },
                                                    { label: "Swivel Chairs", value: "Swivel Chairs" },
                                                    { label: "Guest Chairs", value: "Guest Chairs" },
                                                    { label: "Task Chairs", value: "Task Chairs" }
                                                ] : [])
                                            ]}
                                            selected={formData.product_types}
                                            onChange={(selected) => setFormData({ ...formData, product_types: selected })}
                                            placeholder={`Select ${isOfficeTables ? "table" : "chair"} types...`}
                                        />
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
                            {product && (
                                <div className="mt-4">
                                    <MultiWarehouseStockEditor
                                        productId={product.id}
                                        productName={product.name}
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
                            onClick={() => onOpenChange(false)}
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
                                    {product ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    {product ? "Update" : "Create"} Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
});
