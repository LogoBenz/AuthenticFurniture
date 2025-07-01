export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          slug: string
          category: string
          price: number
          description: string
          features: string[]
          image_url: string
          in_stock: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug?: string
          category: string
          price: number
          description: string
          features?: string[]
          image_url: string
          in_stock?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          category?: string
          price?: number
          description?: string
          features?: string[]
          image_url?: string
          in_stock?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          customer_type: 'retail' | 'bulk' | 'corporate'
          registration_date: string
          last_order_date: string | null
          total_orders: number
          total_spent: number
          average_order_value: number
          preferred_payment_method: string
          notes: string | null
          status: 'active' | 'inactive' | 'vip'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          customer_type?: 'retail' | 'bulk' | 'corporate'
          registration_date?: string
          last_order_date?: string | null
          total_orders?: number
          total_spent?: number
          average_order_value?: number
          preferred_payment_method?: string
          notes?: string | null
          status?: 'active' | 'inactive' | 'vip'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          customer_type?: 'retail' | 'bulk' | 'corporate'
          registration_date?: string
          last_order_date?: string | null
          total_orders?: number
          total_spent?: number
          average_order_value?: number
          preferred_payment_method?: string
          notes?: string | null
          status?: 'active' | 'inactive' | 'vip'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          customer_name: string
          customer_phone: string
          customer_email: string
          items: Json
          total: number
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
          payment_method: 'bank_transfer' | 'mobile_money' | 'installment' | 'cash_on_delivery'
          delivery_address: string
          delivery_zone: string
          order_date: string
          expected_delivery: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          customer_name: string
          customer_phone: string
          customer_email: string
          items: Json
          total: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded'
          payment_method: 'bank_transfer' | 'mobile_money' | 'installment' | 'cash_on_delivery'
          delivery_address: string
          delivery_zone: string
          order_date?: string
          expected_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string
          items?: Json
          total?: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded'
          payment_method?: 'bank_transfer' | 'mobile_money' | 'installment' | 'cash_on_delivery'
          delivery_address?: string
          delivery_zone?: string
          order_date?: string
          expected_delivery?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      delivery_zones: {
        Row: {
          id: string
          name: string
          areas: string[]
          base_price: number
          estimated_days: string
          is_active: boolean
          restrictions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          areas: string[]
          base_price: number
          estimated_days: string
          is_active?: boolean
          restrictions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          areas?: string[]
          base_price?: number
          estimated_days?: string
          is_active?: boolean
          restrictions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          name: string
          phone: string
          vehicle: string
          plate_number: string
          status: 'available' | 'busy' | 'offline'
          current_zone: string
          deliveries_today: number
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          vehicle: string
          plate_number: string
          status?: 'available' | 'busy' | 'offline'
          current_zone: string
          deliveries_today?: number
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          vehicle?: string
          plate_number?: string
          status?: 'available' | 'busy' | 'offline'
          current_zone?: string
          deliveries_today?: number
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      deliveries: {
        Row: {
          id: string
          order_id: string
          customer_name: string
          customer_phone: string
          address: string
          zone: string
          driver_id: string
          status: 'scheduled' | 'in_transit' | 'delivered' | 'failed'
          scheduled_date: string
          delivered_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          customer_name: string
          customer_phone: string
          address: string
          zone: string
          driver_id: string
          status?: 'scheduled' | 'in_transit' | 'delivered' | 'failed'
          scheduled_date: string
          delivered_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          customer_name?: string
          customer_phone?: string
          address?: string
          zone?: string
          driver_id?: string
          status?: 'scheduled' | 'in_transit' | 'delivered' | 'failed'
          scheduled_date?: string
          delivered_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          type: 'email' | 'sms' | 'whatsapp' | 'social'
          status: 'draft' | 'scheduled' | 'active' | 'completed'
          audience: string
          sent_count: number
          open_rate: number
          click_rate: number
          conversion_rate: number
          start_date: string
          end_date: string
          budget: number
          revenue: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'email' | 'sms' | 'whatsapp' | 'social'
          status?: 'draft' | 'scheduled' | 'active' | 'completed'
          audience: string
          sent_count?: number
          open_rate?: number
          click_rate?: number
          conversion_rate?: number
          start_date: string
          end_date: string
          budget: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'email' | 'sms' | 'whatsapp' | 'social'
          status?: 'draft' | 'scheduled' | 'active' | 'completed'
          audience?: string
          sent_count?: number
          open_rate?: number
          click_rate?: number
          conversion_rate?: number
          start_date?: string
          end_date?: string
          budget?: number
          revenue?: number
          created_at?: string
          updated_at?: string
        }
      }
      referral_programs: {
        Row: {
          id: string
          customer_name: string
          referral_code: string
          referrals_count: number
          successful_referrals: number
          total_earned: number
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          referral_code: string
          referrals_count?: number
          successful_referrals?: number
          total_earned?: number
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          referral_code?: string
          referrals_count?: number
          successful_referrals?: number
          total_earned?: number
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for convenience
export type Product = Tables<'products'>
export type Customer = Tables<'customers'>
export type Order = Tables<'orders'>
export type DeliveryZone = Tables<'delivery_zones'>
export type Driver = Tables<'drivers'>
export type Delivery = Tables<'deliveries'>
export type Campaign = Tables<'campaigns'>
export type ReferralProgram = Tables<'referral_programs'>

// Insert types
export type ProductInsert = TablesInsert<'products'>
export type CustomerInsert = TablesInsert<'customers'>
export type OrderInsert = TablesInsert<'orders'>
export type DeliveryZoneInsert = TablesInsert<'delivery_zones'>
export type DriverInsert = TablesInsert<'drivers'>
export type DeliveryInsert = TablesInsert<'deliveries'>
export type CampaignInsert = TablesInsert<'campaigns'>
export type ReferralProgramInsert = TablesInsert<'referral_programs'>

// Update types
export type ProductUpdate = TablesUpdate<'products'>
export type CustomerUpdate = TablesUpdate<'customers'>
export type OrderUpdate = TablesUpdate<'orders'>
export type DeliveryZoneUpdate = TablesUpdate<'delivery_zones'>
export type DriverUpdate = TablesUpdate<'drivers'>
export type DeliveryUpdate = TablesUpdate<'deliveries'>
export type CampaignUpdate = TablesUpdate<'campaigns'>
export type ReferralProgramUpdate = TablesUpdate<'referral_programs'>