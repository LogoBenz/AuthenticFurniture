"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Equal, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentStock: number;
  warehouseId: string;
  warehouseName: string;
  onStockUpdate: (adjustment: StockAdjustment) => Promise<boolean>;
}

interface StockAdjustment {
  type: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
}

export function StockAdjustmentModal({
  isOpen,
  onClose,
  productName,
  currentStock,
  warehouseId,
  warehouseName,
  onStockUpdate
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !reason.trim()) {
      toast.error('Please fill in quantity and reason');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Validate adjustment based on type
    if (adjustmentType === 'remove' && qty > currentStock) {
      toast.error('Cannot remove more stock than available');
      return;
    }

    if (adjustmentType === 'set' && qty < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setIsLoading(true);

    try {
      const adjustment: StockAdjustment = {
        type: adjustmentType,
        quantity: qty,
        reason: reason.trim(),
        notes: notes.trim() || undefined
      };

      const success = await onStockUpdate(adjustment);
      
      if (success) {
        toast.success('Stock updated successfully');
        handleClose();
      } else {
        toast.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('An error occurred while updating stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity('');
    setReason('');
    setNotes('');
    setAdjustmentType('add');
    onClose();
  };

  const getNewStockAmount = () => {
    const qty = parseInt(quantity) || 0;
    switch (adjustmentType) {
      case 'add':
        return currentStock + qty;
      case 'remove':
        return currentStock - qty;
      case 'set':
        return qty;
      default:
        return currentStock;
    }
  };

  const getAdjustmentDescription = () => {
    const qty = parseInt(quantity) || 0;
    switch (adjustmentType) {
      case 'add':
        return `Add ${qty} units to current stock`;
      case 'remove':
        return `Remove ${qty} units from current stock`;
      case 'set':
        return `Set stock to ${qty} units`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Adjust Stock
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Product</p>
            <p className="text-lg font-semibold">{productName}</p>
            <p className="text-sm text-gray-600">Warehouse: {warehouseName}</p>
            <p className="text-sm text-gray-600">Current Stock: <span className="font-medium">{currentStock}</span></p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Label>Choose Action</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={adjustmentType === 'add' ? 'default' : 'outline'}
                className={`h-16 flex flex-col items-center justify-center gap-1 ${
                  adjustmentType === 'add' 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'border-green-200 text-green-700 hover:bg-green-50'
                }`}
                onClick={() => setAdjustmentType('add')}
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">ADD</span>
              </Button>
              
              <Button
                type="button"
                variant={adjustmentType === 'set' ? 'default' : 'outline'}
                className={`h-16 flex flex-col items-center justify-center gap-1 ${
                  adjustmentType === 'set' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                    : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => setAdjustmentType('set')}
              >
                <Equal className="w-6 h-6" />
                <span className="text-sm font-medium">SET TO</span>
              </Button>
              
              <Button
                type="button"
                variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                className={`h-16 flex flex-col items-center justify-center gap-1 ${
                  adjustmentType === 'remove' 
                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                    : 'border-red-200 text-red-700 hover:bg-red-50'
                }`}
                onClick={() => setAdjustmentType('remove')}
              >
                <Minus className="w-6 h-6" />
                <span className="text-sm font-medium">MINUS</span>
              </Button>
            </div>
            
            {/* Action Description */}
            <div className="text-sm text-muted-foreground text-center">
              {adjustmentType === 'add' && 'Add quantity to current stock'}
              {adjustmentType === 'set' && 'Set stock to exact quantity'}
              {adjustmentType === 'remove' && 'Remove quantity from current stock'}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Preview */}
          {quantity && !isNaN(parseInt(quantity)) && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                {getAdjustmentDescription()}
              </p>
              <p className="text-sm font-medium text-blue-800">
                New Stock: {getNewStockAmount()} units
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restock">Restock from supplier</SelectItem>
                <SelectItem value="sale">Sale/Order fulfillment</SelectItem>
                <SelectItem value="damage">Damaged goods</SelectItem>
                <SelectItem value="return">Customer return</SelectItem>
                <SelectItem value="adjustment">Inventory adjustment</SelectItem>
                <SelectItem value="audit">Audit correction</SelectItem>
                <SelectItem value="transfer">Warehouse transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          {/* Warning for large adjustments */}
          {quantity && parseInt(quantity) > 100 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Large Adjustment Warning</p>
                <p>This is a significant stock change. Please ensure the reason and notes are accurate.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
