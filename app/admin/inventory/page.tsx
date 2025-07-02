"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Upload,
  MapPin,
  Warehouse,
  Edit
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getAllProducts, formatPrice } from "@/lib/products";
import { Product } from "@/types";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { StockAdjustmentModal } from "@/components/inventory/StockAdjustmentModal";

interface InventoryItem extends Product {
  stockLevel: number;
  reorderPoint: number;
  location: string;
  lastRestocked: string;
  supplier: string;
  costPrice: number;
}

function InventoryContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const locations = ["Lagos Warehouse", "Abuja Warehouse", "Port Harcourt Store", "Kano Outlet"];

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
      
      // Simulate inventory data with stock levels
      const inventoryData: InventoryItem[] = productsData.map((product, index) => ({
        ...product,
        stockLevel: Math.floor(Math.random() * 50) + 1,
        reorderPoint: 10,
        location: locations[index % locations.length],
        lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        supplier: `Supplier ${String.fromCharCode(65 + (index % 5))}`,
        costPrice: product.price * 0.6 // Assume 40% markup
      }));
      
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "all" || item.location === selectedLocation;
    const matchesStock = stockFilter === "all" || 
                        (stockFilter === "low" && item.stockLevel <= item.reorderPoint) ||
                        (stockFilter === "out" && item.stockLevel === 0) ||
                        (stockFilter === "good" && item.stockLevel > item.reorderPoint);
    
    return matchesSearch && matchesLocation && matchesStock;
  });

  const lowStockItems = inventory.filter(item => item.stockLevel <= item.reorderPoint && item.stockLevel > 0);
  const outOfStockItems = inventory.filter(item => item.stockLevel === 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.stockLevel * item.costPrice), 0);

  const getStockStatus = (item: InventoryItem) => {
    if (item.stockLevel === 0) return { label: "Out of Stock", color: "destructive" };
    if (item.stockLevel <= item.reorderPoint) return { label: "Low Stock", color: "secondary" };
    return { label: "In Stock", color: "default" };
  };

  const handleStockUpdate = async (productId: number, newStock: number, reason: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API call here
      console.log('Updating stock:', { productId, newStock, reason });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setInventory(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, stockLevel: newStock, lastRestocked: new Date().toISOString().split('T')[0] }
          : item
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  };

  const openStockModal = (item: InventoryItem) => {
    setSelectedProduct(item);
    setIsStockModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Inventory Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Track stock levels across all locations
        </p>
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{inventory.length}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Across {locations.length} locations
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatPrice(totalValue)}</div>
            <p className="text-xs text-green-700 dark:text-green-300">
              Cost basis
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{lowStockItems.length}</div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Need reordering
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{outOfStockItems.length}</div>
            <p className="text-xs text-red-700 dark:text-red-300">
              Urgent restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Stock Alerts:</strong> {outOfStockItems.length} items out of stock, {lowStockItems.length} items low on stock.
            Consider placing reorders soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Filters & Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Stock Levels</option>
                <option value="good">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item);
              // Convert single image URL to array for gallery component
              const images = [item.imageUrl];
              
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16">
                      <ProductImageGallery
                        images={images}
                        productName={item.name}
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={status.color as any}>{status.label}</Badge>
                      <span className="font-medium">{item.stockLevel} units</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reorder at: {item.reorderPoint}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Value: {formatPrice(item.stockLevel * item.costPrice)}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openStockModal(item)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update Stock
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <StockAdjustmentModal
          isOpen={isStockModalOpen}
          onClose={() => {
            setIsStockModalOpen(false);
            setSelectedProduct(null);
          }}
          productName={selectedProduct.name}
          currentStock={selectedProduct.stockLevel}
          onStockUpdate={(newStock, reason) => handleStockUpdate(selectedProduct.id, newStock, reason)}
        />
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <InventoryContent />
    </ProtectedRoute>
  );
}