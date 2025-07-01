"use client";

import { useState } from "react";
import { X, User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  customerType: 'retail' | 'bulk' | 'corporate';
  status: 'active' | 'inactive';
  notes: string;
}

// Helper function to extract error message from various error formats
function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error?.message) {
    return error.error.message;
  }
  
  if (error?.error?.details) {
    return `Network error: ${error.error.details}`;
  }
  
  if (error?.details) {
    return error.details;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

export function AddCustomerModal({ isOpen, onClose, onCustomerAdded }: AddCustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    customerType: "retail",
    status: "active",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      customerType: "retail",
      status: "active",
      notes: "",
    });
    setError("");
    setSuccess("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }

    // Basic phone validation for Nigerian numbers
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError("Please enter a valid Nigerian phone number (e.g., +234 801 234 5678 or 08012345678)");
      return false;
    }

    if (!formData.address.trim()) {
      setError("Shipping address is required");
      return false;
    }

    if (!formData.city.trim()) {
      setError("City is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || !supabaseUrl.includes('supabase.co')) {
        throw new Error('Supabase is not configured. Please set up your environment variables to add customers.');
      }

      // Prepare customer data for Supabase
      const customerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        customer_type: formData.customerType,
        status: formData.status,
        notes: formData.notes.trim() || null,
        registration_date: new Date().toISOString(),
        total_orders: 0,
        total_spent: 0,
        average_order_value: 0,
        preferred_payment_method: 'bank_transfer',
        last_order_date: null,
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        const errorMessage = getErrorMessage(error);
        
        // Check if it's a network/connection error
        if (errorMessage.includes('Network connection failed') || 
            errorMessage.includes('signal is aborted') ||
            errorMessage.includes('Failed to fetch') ||
            error.code === 'NETWORK_ERROR' ||
            error.code === 20) {
          throw new Error('Connection failed. Please check your internet connection and Supabase configuration.');
        }
        
        throw new Error(`Failed to add customer: ${errorMessage}`);
      }

      setSuccess("Customer added successfully!");
      
      // Reset form and close modal after a brief delay
      setTimeout(() => {
        resetForm();
        onCustomerAdded();
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Add customer error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && !isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Add New Customer
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter customer's full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="customer@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+234 801 234 5678"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: +234 801 234 5678 or 08012345678
                </p>
              </div>

              <div>
                <Label htmlFor="city" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Lagos, Abuja, Port Harcourt, etc."
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Address Information</h3>
            
            <div>
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Shipping Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete shipping address including street, area, and landmarks"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Account Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <select
                  id="customerType"
                  value={formData.customerType}
                  onChange={(e) => handleInputChange("customerType", e.target.value as any)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  disabled={isLoading}
                >
                  <option value="retail">Retail Customer</option>
                  <option value="bulk">Bulk Buyer</option>
                  <option value="corporate">Corporate Client</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Account Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  disabled={isLoading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
            
            <div>
              <Label htmlFor="notes" className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Customer Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add any special notes about this customer (preferences, special requirements, etc.)"
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Registration Date Info */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Registration date will be automatically set to today's date</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Adding Customer...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Add Customer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}