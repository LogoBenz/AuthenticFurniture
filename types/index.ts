export interface Product {
  id: string; // Changed from number to string for UUID compatibility
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  imageUrl: string; // Keep for backward compatibility - will be first image
  inStock: boolean;
  isFeatured: boolean;
  // New fields for promo and best seller functionality
  original_price?: number;
  discount_percent?: number;
  is_promo?: boolean;
  is_best_seller?: boolean;
  is_new?: boolean;
  // New inventory fields
  modelNo?: string;
  warehouseLocation?: string; // This will store the warehouse ID
  dimensions?: string;
  // New category system
  space_id?: string;
  subcategory_id?: string;
  space?: Space;
  subcategory?: Subcategory;
  // Enhanced product view page fields
  discount_enabled?: boolean;
  bulk_pricing_enabled?: boolean;
  bulk_pricing_tiers?: Array<{
    min_quantity: number;
    max_quantity?: number;
    price: number;
    discount_percent?: number;
  }>;
  ships_from?: string; // Lagos, Abuja, etc.
  popular_with?: string[]; // Schools, Offices, Hotels, Lounges, etc.
  badges?: string[]; // Best Seller, New Arrival, Limited Stock
  materials?: string;
  weight_capacity?: string;
  warranty?: string;
  delivery_timeframe?: string;
  stock_count?: number;
  limited_time_deal?: {
    enabled: boolean;
    end_date: string;
    discount_percent: number;
  };
}

export interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  space_id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  space?: Space;
}

export interface Warehouse {
  id: string;
  name: string;
  state: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  mapLink?: string;
  capacity?: number;
  notes?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseGroup {
  state: string;
  warehouses: Warehouse[];
}

export interface ProductsData {
  products: Product[];
}

// New interfaces for admin functionality
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  customerType: 'retail' | 'bulk' | 'corporate';
  registrationDate: string;
  lastOrderDate: string | null;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  preferredPaymentMethod: string;
  notes: string | null;
  status: 'active' | 'inactive' | 'vip';
  communicationHistory: Array<{
    date: string;
    type: 'call' | 'email' | 'whatsapp' | 'visit';
    subject: string;
    notes: string;
  }>;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod: 'bank_transfer' | 'mobile_money' | 'installment' | 'cash_on_delivery';
  deliveryAddress: string;
  deliveryZone: string;
  orderDate: string;
  expectedDelivery: string | null;
  notes: string | null;
}

export interface DeliveryZone {
  id: string;
  name: string;
  areas: string[];
  basePrice: number;
  estimatedDays: string;
  isActive: boolean;
  restrictions: string[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  status: 'available' | 'busy' | 'offline';
  currentZone: string;
  deliveriesToday: number;
  rating: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  zone: string;
  driverId: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'failed';
  scheduledDate: string;
  deliveredDate: string | null;
  notes: string | null;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  audience: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  startDate: string;
  endDate: string;
  budget: number;
  revenue: number;
}

export interface ReferralProgram {
  id: string;
  customerName: string;
  referralCode: string;
  referralsCount: number;
  successfulReferrals: number;
  totalEarned: number;
  status: 'active' | 'inactive';
}