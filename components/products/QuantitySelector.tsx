"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className = ""
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleDecrease = () => {
    if (disabled) return;
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleIncrease = () => {
    if (disabled) return;
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    } else {
      setInputValue(numValue.toString());
      onChange(numValue);
    }
  };

  return (
    <div className={`flex items-center border border-slate-200 dark:border-slate-700 rounded-md ${className}`}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="h-10 w-10 p-0 rounded-r-none border-r border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={max}
        disabled={disabled}
        className="h-10 w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="h-10 w-10 p-0 rounded-l-none border-l border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
