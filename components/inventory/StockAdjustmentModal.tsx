"use client";

import { useState } from "react";
import { Plus, Minus, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentStock: number;
  onStockUpdate: (newStock: number, reason: string) => Promise<boolean>;
}

export function StockAdjustmentModal({
  isOpen,
  onClose,
  productName,
  currentStock,
  onStockUpdate
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'set' | 'add' | 'subtract'>('set');
  const [adjustmentValue, setAdjustmentValue] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const calculateNewStock = (): number => {
    const value = parseInt(adjustmentValue) || 0;
    
    switch (adjustmentType) {
      case 'set':
        return value;
      case 'add':
        return currentStock + value;
      case 'subtract':
        return Math.max(0, currentStock - value);
      default:
        return currentStock;
    }
  };

  const newStock = calculateNewStock();
  const stockDifference = newStock - currentStock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!adjustmentValue || parseInt(adjustmentValue) < 0) {
      setError('Please enter a valid positive number');
      return;
    }

    if (newStock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the stock adjustment');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onStockUpdate(newStock, reason.trim());
      
      if (success) {
        // Reset form and close modal
        setAdjustmentValue('');
        setReason('');
        setAdjustmentType('set');
        onClose();
      } else {
        setError('Failed to update stock. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while updating stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAdjustmentValue('');
      setReason('');
      setAdjustmentType('set');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Update Stock Level
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p className="font-medium text-sm">{productName}</p>
            <p className="text-sm text-muted-foreground">
              Current Stock: <span className="font-medium">{currentStock} units</span>
            </p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Adjustment Type */}
            <div>
              <Label>Adjustment Type</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'set' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdjustmentType('set')}
                  disabled={isLoading}
                >
                  Set To
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'add' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdjustmentType('add')}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'subtract' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAdjustmentType('subtract')}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Adjustment Value */}
            <div>
              <Label htmlFor="adjustmentValue">
                {adjustmentType === 'set' ? 'New Stock Level' : 
                 adjustmentType === 'add' ? 'Quantity to Add' : 'Quantity to Remove'}
              </Label>
              <Input
                id="adjustmentValue"
                type="number"
                min="0"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                placeholder="Enter quantity"
                required
                disabled={isLoading}
              />
            </div>

            {/* Stock Preview */}
            {adjustmentValue && (
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>Current Stock:</span>
                  <span className="font-medium">{currentStock}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Change:</span>
                  <span className={`font-medium ${
                    stockDifference > 0 ? 'text-green-600' : 
                    stockDifference < 0 ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {stockDifference > 0 ? '+' : ''}{stockDifference}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
                  <span>New Stock:</span>
                  <span className="text-blue-600 dark:text-blue-400">{newStock}</span>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <Label htmlFor="reason">Reason for Adjustment *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Received new shipment, Damaged items removed, Inventory count correction..."
                rows={3}
                required
                disabled={isLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !adjustmentValue || !reason.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Stock'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}