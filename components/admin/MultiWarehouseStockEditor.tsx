'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Warehouse {
  id: string;
  name: string;
  state: string;
  isAvailable: boolean;
}

interface WarehouseStock {
  warehouseId: string;
  productId: string;
  stockQuantity: number;
  reservedQuantity?: number;
  reorderLevel?: number;
}

interface MultiWarehouseStockEditorProps {
  productId: string;
  productName: string;
  onStockUpdate?: (updates: WarehouseStock[]) => void;
}

export default function MultiWarehouseStockEditor({
  productId,
  productName,
  onStockUpdate
}: MultiWarehouseStockEditorProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stockData, setStockData] = useState<WarehouseStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

  // Fetch warehouses and current stock
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch warehouses
        const warehousesResponse = await fetch('/api/inventory/warehouses');
        if (warehousesResponse.ok) {
          const { warehouses } = await warehousesResponse.json();
          setWarehouses(warehouses || []);
        }

        // Fetch current stock for this product
        const stockPromises = warehouses.map(async (warehouse) => {
          const response = await fetch(`/api/inventory/stock?warehouseId=${warehouse.id}`);
          if (response.ok) {
            const { inventory } = await response.json();
            return inventory.find((item: any) => item.product_id === productId);
          }
          return null;
        });

        const stockResults = await Promise.all(stockPromises);
        const currentStock = stockResults
          .filter(Boolean)
          .map((item: any) => ({
            warehouseId: item.warehouse_id,
            productId: item.product_id,
            stockQuantity: item.stock_quantity || 0,
            reservedQuantity: item.reserved_quantity || 0,
            reorderLevel: item.reorder_level || 0,
          }));

        setStockData(currentStock);
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
        toast.error('Failed to load warehouse data');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleStockChange = (warehouseId: string, field: keyof WarehouseStock, value: number) => {
    setStockData(prev => {
      const existing = prev.find(item => item.warehouseId === warehouseId);
      if (existing) {
        return prev.map(item =>
          item.warehouseId === warehouseId
            ? { ...item, [field]: value }
            : item
        );
      } else {
        return [...prev, {
          warehouseId,
          productId,
          stockQuantity: 0,
          reservedQuantity: 0,
          reorderLevel: 0,
          [field]: value
        }];
      }
    });
  };

  const addWarehouseStock = () => {
    if (!selectedWarehouse) {
      toast.error('Please select a warehouse');
      return;
    }

    const exists = stockData.some(item => item.warehouseId === selectedWarehouse);
    if (exists) {
      toast.error('Stock for this warehouse already exists');
      return;
    }

    setStockData(prev => [...prev, {
      warehouseId: selectedWarehouse,
      productId,
      stockQuantity: 0,
      reservedQuantity: 0,
      reorderLevel: 0,
    }]);

    setSelectedWarehouse('');
  };

  const removeWarehouseStock = (warehouseId: string) => {
    setStockData(prev => prev.filter(item => item.warehouseId !== warehouseId));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/inventory/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockUpdates: stockData.map(item => ({
            warehouseId: item.warehouseId,
            productId: item.productId,
            stockQuantity: item.stockQuantity,
            reservedQuantity: item.reservedQuantity || 0,
            reorderLevel: item.reorderLevel || 0,
          }))
        }),
      });

      if (response.ok) {
        toast.success('Stock updated successfully');
        onStockUpdate?.(stockData);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Error saving stock:', error);
      toast.error('Failed to save stock');
    } finally {
      setSaving(false);
    }
  };

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.state})` : 'Unknown Warehouse';
  };

  const getAvailableWarehouses = () => {
    const usedWarehouseIds = stockData.map(item => item.warehouseId);
    return warehouses.filter(w => !usedWarehouseIds.includes(w.id));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading warehouse data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Multi-Warehouse Stock Management</span>
          <Badge variant="outline">{productName}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new warehouse stock */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="warehouse-select">Add Warehouse</Label>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse to add stock" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableWarehouses().map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.state})
                    {!warehouse.isAvailable && ' - Full'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addWarehouseStock} disabled={!selectedWarehouse}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Stock table */}
        {stockData.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Current Stock Distribution</h4>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Stock Quantity</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item) => (
                    <TableRow key={item.warehouseId}>
                      <TableCell className="font-medium">
                        {getWarehouseName(item.warehouseId)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.stockQuantity}
                          onChange={(e) => handleStockChange(item.warehouseId, 'stockQuantity', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.reservedQuantity || 0}
                          onChange={(e) => handleStockChange(item.warehouseId, 'reservedQuantity', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.reorderLevel || 0}
                          onChange={(e) => handleStockChange(item.warehouseId, 'reorderLevel', parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWarehouseStock(item.warehouseId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stock assigned to any warehouse yet.</p>
            <p className="text-sm">Add a warehouse above to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}