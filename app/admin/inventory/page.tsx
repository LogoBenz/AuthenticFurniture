'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Package, Warehouse, Edit, Save, X, Loader2, Plus, Minus } from 'lucide-react';
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
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseStock | null>(null);
  const [editValues, setEditValues] = useState({
    stock_quantity: 0,
    reserved_quantity: 0,
    reorder_level: 0,
  });
  const [saving, setSaving] = useState(false);
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

  const handleEdit = (warehouseStock: WarehouseStock) => {
    setEditingWarehouse(warehouseStock);
    setEditValues({
      stock_quantity: warehouseStock.stock_quantity,
      reserved_quantity: warehouseStock.reserved_quantity,
      reorder_level: warehouseStock.reorder_level,
    });
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

  const handleSave = async () => {
    if (!editingWarehouse) return;

    try {
      setSaving(true);
      
      const response = await fetch('/api/inventory/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockUpdates: [{
            warehouseId: editingWarehouse.warehouse_id,
            productId: editingWarehouse.product_id,
            stockQuantity: editValues.stock_quantity,
            reservedQuantity: editValues.reserved_quantity,
            reorderLevel: editValues.reorder_level,
          }]
        }),
      });

      if (response.ok) {
        // Refresh inventory data
        const inventoryResponse = await fetch('/api/inventory/all');
        if (inventoryResponse.ok) {
          const { inventory: fetchedInventory } = await inventoryResponse.json();
          setInventory(fetchedInventory || []);
        }
        
        toast.success('Stock updated successfully');
        setEditingWarehouse(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingWarehouse(null);
    setEditValues({
      stock_quantity: 0,
      reserved_quantity: 0,
      reorder_level: 0,
    });
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.state})` : 'Unknown Warehouse';
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
        
        <div className="sm:w-64">
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
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventory
            <Badge variant="secondary" className="ml-2">
              {filteredInventory.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No inventory found.</p>
              <p className="text-sm">Try adjusting your search or warehouse filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Model No</TableHead>
                    <TableHead>Total Stock</TableHead>
                    <TableHead>Warehouses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item.totalStock, Math.max(...item.warehouses.map(w => w.reorder_level)));
                    
                    return (
                      <TableRow key={item.product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {item.product.images?.[0] && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ₦{item.product.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-mono text-sm">
                          {item.product.model_no || 'N/A'}
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-center">
                            <div className="font-bold text-lg">{item.totalStock}</div>
                            <div className="text-xs text-muted-foreground">
                              Available: {item.totalAvailable}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            {item.warehouses.map((warehouse) => (
                              <div key={warehouse.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Warehouse className="h-3 w-3 mr-1" />
                                  <span className="font-medium">{warehouse.warehouse.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono font-semibold text-lg">{warehouse.stock_quantity}</span>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStockAdjustment(warehouse)}
                                      className="h-7 w-7 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                      title="Adjust Stock"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={stockStatus.color as any}>
                            {stockStatus.status === 'out' ? 'Out of Stock' :
                             stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockAdjustment(item.warehouses[0])}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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