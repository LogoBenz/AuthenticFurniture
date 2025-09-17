"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Warehouse, WarehouseGroup } from "@/types";
import { getWarehousesGroupedByState } from "@/lib/warehouses";

interface WarehouseSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showWarning?: boolean;
  className?: string;
}

export function WarehouseSelector({
  value,
  onValueChange,
  placeholder = "Select warehouse",
  disabled = false,
  showWarning = true,
  className
}: WarehouseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [warehouseGroups, setWarehouseGroups] = useState<WarehouseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    if (value && warehouseGroups.length > 0) {
      const warehouse = warehouseGroups
        .flatMap(group => group.warehouses)
        .find(w => w.id === value);
      setSelectedWarehouse(warehouse || null);
    } else {
      setSelectedWarehouse(null);
    }
  }, [value, warehouseGroups]);

  const loadWarehouses = async () => {
    try {
      const groups = await getWarehousesGroupedByState();
      setWarehouseGroups(groups);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    onValueChange(warehouse.id);
    setIsOpen(false);
  };

  const displayValue = selectedWarehouse 
    ? `${selectedWarehouse.name} (${selectedWarehouse.state})`
    : placeholder;

  return (
    <div className={cn("relative", className)}>
      <Label className="text-sm font-medium mb-2 block">Warehouse Location</Label>
      
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-between text-left font-normal",
          !selectedWarehouse && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{displayValue}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading warehouses...
            </div>
          ) : warehouseGroups.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No warehouses available
            </div>
          ) : (
            <div className="py-1">
              {warehouseGroups.map((group) => (
                <div key={group.state} className="group">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    {group.state}
                  </div>
                  
                  {group.warehouses.map((warehouse) => (
                    <button
                      key={warehouse.id}
                      type="button"
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                        "flex items-center justify-between",
                        selectedWarehouse?.id === warehouse.id && "bg-slate-100 dark:bg-slate-800"
                      )}
                      onClick={() => handleWarehouseSelect(warehouse)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate">{warehouse.name}</span>
                        {!warehouse.isAvailable && showWarning && (
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      {!warehouse.isAvailable && showWarning && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 ml-2">
                          Full
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedWarehouse && !selectedWarehouse.isAvailable && showWarning && (
        <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-md">
          <div className="flex items-center gap-2 text-sm text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-3 w-3" />
            <span>This warehouse is currently at full capacity</span>
          </div>
        </div>
      )}
    </div>
  );
}
