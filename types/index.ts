export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  inStock: boolean;
  isFeatured: boolean;
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