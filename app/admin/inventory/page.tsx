'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Search, Package, Warehouse, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Warehouse as WarehouseType } from '@/types';
import Image from 'next/image';
import { StockAdjustmentModal } from '@/components/admin/StockAdjustmentModal';

interface WarehouseStock {
  id: string;
  warehouse_id: string;
  product_id: string;
  warehouse: {
    id: string;
    name: string;
    state: string;
    address?: string;
  };
  stock_quantity: number;
  reserved_quantity: number;
  reorder_level: number;
  last_updated: string;
}

interface InventoryItem {
  product: {
    id: string;
    name: string;
    model_no: string;
    price: number;
    images: string[];
    in_stock: boolean;
  };
  warehouses: WarehouseStock[];
  totalStock: number;
  totalReserved: number;
  totalAvailable: number;
}

export default function AdminInventoryPage() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseStock | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);

  // Fetch warehouses and inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch warehouses
        const warehousesResponse = await fetch('/api/inventory/warehouses');
        if (warehousesResponse.ok) {
          const { warehouses: fetchedWarehouses } = await warehousesResponse.json();
          setWarehouses(fetchedWarehouses || []);
        }

        // Fetch all inventory using the new API
        const inventoryResponse = await fetch('/api/inventory/all');
        if (inventoryResponse.ok) {
          const { inventory: fetchedInventory } = await inventoryResponse.json();
          console.log('📦 Inventory data sample:', fetchedInventory[0]); // Debug log
          setInventory(fetchedInventory || []);
        }
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        toast.error('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling to refresh inventory every 30 seconds
    const intervalId = setInterval(fetchData, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle warehouse selection change
  const handleWarehouseChange = async (warehouseId: string) => {
    setSelectedWarehouse(warehouseId);
    
    try {
      setLoading(true);
      const response = await fetch(`/api/inventory/all?warehouseId=${warehouseId}`);
      if (response.ok) {
        const { inventory: fetchedInventory } = await response.json();
        setInventory(fetchedInventory || []);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = (warehouseStock: WarehouseStock) => {
    setEditingWarehouse(warehouseStock);
    setShowStockModal(true);
  };

  const handleStockUpdate = async (adjustment: any) => {
    try {
      const response = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          warehouse_id: editingWarehouse?.warehouse_id,
          product_id: editingWarehouse?.product_id,
          ...adjustment
        }),
      });

      if (response.ok) {
        // Refresh inventory data
        const inventoryResponse = await fetch('/api/inventory/all');
        if (inventoryResponse.ok) {
          const { inventory: fetchedInventory } = await inventoryResponse.json();
          setInventory(fetchedInventory || []);
        }
        return true;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update stock');
        return false;
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
      return false;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.model_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by warehouse if selected
    if (selectedWarehouse !== 'all') {
      return matchesSearch && item.warehouses.some(w => w.warehouse_id === selectedWarehouse);
    }
    
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.product.name.localeCompare(b.product.name);
      case 'name-desc':
        return b.product.name.localeCompare(a.product.name);
      case 'stock-asc':
        return a.totalStock - b.totalStock;
      case 'stock-desc':
        return b.totalStock - a.totalStock;
      case 'price-asc':
        return a.product.price - b.product.price;
      case 'price-desc':
        return b.product.price - a.product.price;
      default:
        return 0;
    }
  });

  const getStockStatus = (totalStock: number, reorderLevel: number) => {
    if (totalStock <= 0) return { status: 'out', color: 'destructive' };
    if (totalStock <= reorderLevel) return { status: 'low', color: 'destructive' };
    return { status: 'good', color: 'default' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage stock across all warehouses</p>
        </div>
        <Button 
          onClick={async () => {
            setLoading(true);
            try {
              const inventoryResponse = await fetch('/api/inventory/all');
              if (inventoryResponse.ok) {
                const { inventory: fetchedInventory } = await inventoryResponse.json();
                setInventory(fetchedInventory || []);
                toast.success('Inventory refreshed');
              }
            } catch (error) {
              toast.error('Failed to refresh inventory');
            } finally {
              setLoading(false);
            }
          }}
          variant="outline"
        >
          <Package className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by product name or model number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="sm:w-48">
          <Label htmlFor="warehouse">Warehouse</Label>
          <Select value={selectedWarehouse} onValueChange={handleWarehouseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map(warehouse => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.state})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:w-48">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Grid - Modern Card Layout */}
      {filteredInventory.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-30 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No inventory found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or warehouse filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.map((item) => {
            const stockStatus = getStockStatus(item.totalStock, Math.max(...item.warehouses.map(w => w.reorder_level)));
            
            // Handle images - they might be a JSON string, array, or null
            let imageUrl = null;
            if (item.product.images) {
              if (typeof item.product.images === 'string') {
                try {
                  const parsed = JSON.parse(item.product.images);
                  imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
                } catch {
                  // If it's a string but not JSON, use it directly
                  imageUrl = item.product.images;
                }
              } else if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                imageUrl = item.product.images[0];
              }
            }
            
            return (
              <Card key={item.product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'flex items-center justify-center h-full';
                          fallback.innerHTML = '<svg class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Stock Status Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={stockStatus.color as any}
                      className="shadow-md"
                    >
                      {stockStatus.status === 'out' ? 'Out of Stock' :
                       stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-mono">{item.product.model_no || 'N/A'}</span>
                      <span className="font-semibold text-foreground">
                        ₦{item.product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Total Stock */}
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 mb-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {item.totalStock}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total Stock ({item.totalAvailable} available)
                      </div>
                    </div>
                  </div>

                  {/* Warehouse Breakdown */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Warehouses
                    </div>
                    {item.warehouses.map((warehouse) => (
                      <div 
                        key={warehouse.id} 
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Warehouse className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {warehouse.warehouse.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {warehouse.stock_quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStockAdjustment(warehouse)}
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                            title="Adjust Stock"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {editingWarehouse && (
        <StockAdjustmentModal
          isOpen={showStockModal}
          onClose={() => {
            setShowStockModal(false);
            setEditingWarehouse(null);
          }}
          productName={inventory.find(item => 
            item.warehouses.some(w => w.id === editingWarehouse.id)
          )?.product.name || ''}
          currentStock={editingWarehouse.stock_quantity}
          warehouseId={editingWarehouse.warehouse_id}
          warehouseName={editingWarehouse.warehouse.name}
          onStockUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
}