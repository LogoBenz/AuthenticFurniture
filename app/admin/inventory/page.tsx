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
import { Search, Package, Warehouse, Edit, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Warehouse as WarehouseType } from '@/types';
import Image from 'next/image';

interface InventoryItem {
  id: string;
  warehouse_id: string;
  product_id: string;
  stock_quantity: number;
  reserved_quantity: number;
  reorder_level: number;
  products: {
    id: string;
    name: string;
    model_no: string;
    price: number;
    images: string[];
  };
}

export default function AdminInventoryPage() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editValues, setEditValues] = useState({
    stock_quantity: 0,
    reserved_quantity: 0,
    reorder_level: 0,
  });
  const [saving, setSaving] = useState(false);

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

          // Fetch inventory for all warehouses
          const inventoryPromises = (fetchedWarehouses || []).map(async (warehouse: WarehouseType) => {
            const response = await fetch(`/api/inventory/stock?warehouseId=${warehouse.id}`);
            if (response.ok) {
              const { inventory } = await response.json();
              return inventory || [];
            }
            return [];
          });

          const inventoryResults = await Promise.all(inventoryPromises);
          const allInventory = inventoryResults.flat();
          setInventory(allInventory);
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

  // Fetch inventory for specific warehouse
  const fetchWarehouseInventory = async (warehouseId: string) => {
    try {
      const response = await fetch(`/api/inventory/stock?warehouseId=${warehouseId}`);
      if (response.ok) {
        const { inventory } = await response.json();
        return inventory || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching warehouse inventory:', error);
      return [];
    }
  };

  // Handle warehouse selection change
  const handleWarehouseChange = async (warehouseId: string) => {
    setSelectedWarehouse(warehouseId);
    
    if (warehouseId === 'all') {
      // Fetch all inventory
      const inventoryPromises = warehouses.map(async (warehouse) => {
        const response = await fetch(`/api/inventory/stock?warehouseId=${warehouse.id}`);
        if (response.ok) {
          const { inventory } = await response.json();
          return inventory || [];
        }
        return [];
      });

      const inventoryResults = await Promise.all(inventoryPromises);
      const allInventory = inventoryResults.flat();
      setInventory(allInventory);
    } else {
      // Fetch specific warehouse inventory
      const warehouseInventory = await fetchWarehouseInventory(warehouseId);
      setInventory(warehouseInventory);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditValues({
      stock_quantity: item.stock_quantity,
      reserved_quantity: item.reserved_quantity,
      reorder_level: item.reorder_level,
    });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      setSaving(true);
      
      const response = await fetch('/api/inventory/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockUpdates: [{
            warehouseId: editingItem.warehouse_id,
            productId: editingItem.product_id,
            stockQuantity: editValues.stock_quantity,
            reservedQuantity: editValues.reserved_quantity,
            reorderLevel: editValues.reorder_level,
          }]
        }),
      });

      if (response.ok) {
        // Update local state
        setInventory(prev => 
          prev.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...editValues }
              : item
          )
        );
        
        toast.success('Stock updated successfully');
        setEditingItem(null);
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
    setEditingItem(null);
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
      item.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products.model_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock_quantity <= 0) return { status: 'out', color: 'destructive' };
    if (item.stock_quantity <= item.reorder_level) return { status: 'low', color: 'destructive' };
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
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const isEditing = editingItem?.id === item.id;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {item.products.images?.[0] && (
                              <Image
                                src={item.products.images[0]}
                                alt={item.products.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{item.products.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ₦{item.products.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-mono text-sm">
                          {item.products.model_no || 'N/A'}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center">
                            <Warehouse className="h-4 w-4 mr-1" />
                            {getWarehouseName(item.warehouse_id)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              value={editValues.stock_quantity}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                stock_quantity: parseInt(e.target.value) || 0
                              }))}
                              className="w-20"
                            />
                          ) : (
                            <span className="font-medium">{item.stock_quantity}</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              value={editValues.reserved_quantity}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                reserved_quantity: parseInt(e.target.value) || 0
                              }))}
                              className="w-20"
                            />
                          ) : (
                            <span>{item.reserved_quantity}</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              value={editValues.reorder_level}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                reorder_level: parseInt(e.target.value) || 0
                              }))}
                              className="w-20"
                            />
                          ) : (
                            <span>{item.reorder_level}</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={stockStatus.color as any}>
                            {stockStatus.status === 'out' ? 'Out of Stock' :
                             stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {isEditing ? (
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={saving}
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
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
    </div>
  );
}