import { supabase } from './supabase';
import { Warehouse, WarehouseGroup } from '@/types';

function mapSupabaseRowToWarehouse(row: any): Warehouse {
  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    state: String(row.state || ''),
    address: row.address ? String(row.address) : undefined,
    contactPhone: row.contact_phone ? String(row.contact_phone) : undefined,
    contactEmail: row.contact_email ? String(row.contact_email) : undefined,
    mapLink: row.map_link ? String(row.map_link) : undefined,
    capacity: row.capacity ? Number(row.capacity) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    isAvailable: Boolean(row.is_available),
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.trim() !== '' &&
    supabaseKey.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl.includes('supabase.co')
  );
}

// Get all warehouses
export async function getAllWarehouses(): Promise<Warehouse[]> {
  if (!isSupabaseConfigured()) {
    // Return fallback data if Supabase is not configured
    return [
      {
        id: '1',
        name: 'Ikeja Warehouse',
        state: 'Lagos',
        address: '123 Ikeja Industrial Estate, Lagos',
        contactPhone: '+234 801 234 5678',
        contactEmail: 'ikeja@company.com',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Lekki Warehouse',
        state: 'Lagos',
        address: '456 Lekki Phase 1, Lagos',
        contactPhone: '+234 802 345 6789',
        contactEmail: 'lekki@company.com',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Garki Warehouse',
        state: 'Abuja',
        address: '321 Garki Area 11, Abuja',
        contactPhone: '+234 804 567 8901',
        contactEmail: 'garki@company.com',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  try {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('state', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      throw new Error(`Database fetch failed: ${error.message}`);
    }

    return (data || []).map(mapSupabaseRowToWarehouse);
  } catch (error) {
    console.error('❌ Get warehouses error:', error);
    throw error;
  }
}

// Get warehouses grouped by state
export async function getWarehousesGroupedByState(): Promise<WarehouseGroup[]> {
  const warehouses = await getAllWarehouses();
  
  const grouped = warehouses.reduce((groups: WarehouseGroup[], warehouse) => {
    const existingGroup = groups.find(group => group.state === warehouse.state);
    
    if (existingGroup) {
      existingGroup.warehouses.push(warehouse);
    } else {
      groups.push({
        state: warehouse.state,
        warehouses: [warehouse],
      });
    }
    
    return groups;
  }, []);
  
  return grouped.sort((a, b) => a.state.localeCompare(b.state));
}

// Get warehouses by state
export async function getWarehousesByState(state: string): Promise<Warehouse[]> {
  const warehouses = await getAllWarehouses();
  return warehouses.filter(warehouse => warehouse.state === state);
}

// Get available warehouses
export async function getAvailableWarehouses(): Promise<Warehouse[]> {
  const warehouses = await getAllWarehouses();
  return warehouses.filter(warehouse => warehouse.isAvailable);
}

// Create warehouse
export async function createWarehouse(warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot create warehouse.');
  }

  try {
    const warehouseData = {
      name: warehouse.name,
      state: warehouse.state,
      address: warehouse.address || null,
      contact_phone: warehouse.contactPhone || null,
      contact_email: warehouse.contactEmail || null,
      map_link: warehouse.mapLink || null,
      capacity: warehouse.capacity || null,
      notes: warehouse.notes || null,
      is_available: warehouse.isAvailable,
    };

    const { data, error } = await supabase
      .from('warehouses')
      .insert(warehouseData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase create error:', error);
      throw new Error(`Database create failed: ${error.message}`);
    }

    return mapSupabaseRowToWarehouse(data);
  } catch (error) {
    console.error('❌ Create warehouse error:', error);
    throw error;
  }
}

// INVENTORY (warehouse_products junction) -----------------------------------

export interface WarehouseProductStock {
  warehouse_id: string;
  product_id: string;
  stock_count: number;
  product?: any;
}

export async function getInventoryByWarehouse(warehouseId: string): Promise<any[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('warehouse_products')
    .select(`
      *,
      products (
        id,
        name,
        model_no,
        price,
        images,
        in_stock
      )
    `)
    .eq('warehouse_id', warehouseId);

  if (error) {
    console.error('❌ Fetch inventory error:', error);
    return [];
  }

  return data || [];
}

// Get total inventory across all warehouses for a product
export async function getProductTotalInventory(productId: string): Promise<{
  totalStock: number;
  totalReserved: number;
  availableStock: number;
}> {
  if (!isSupabaseConfigured()) {
    return { totalStock: 0, totalReserved: 0, availableStock: 0 };
  }

  try {
    const { data, error } = await supabase
      .rpc('get_product_total_inventory', { product_id_param: parseInt(productId) });

    if (error) {
      console.error('❌ Get product inventory error:', error);
      return { totalStock: 0, totalReserved: 0, availableStock: 0 };
    }

    return data?.[0] || { totalStock: 0, totalReserved: 0, availableStock: 0 };
  } catch (error) {
    console.error('❌ Get product inventory error:', error);
    return { totalStock: 0, totalReserved: 0, availableStock: 0 };
  }
}

// Update inventory on sale
export async function updateInventoryOnSale(
  productId: string, 
  warehouseId: string, 
  quantity: number
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    // First check if we have enough stock
    const { data: currentStock, error: fetchError } = await supabase
      .from('warehouse_products')
      .select('stock_quantity, reserved_quantity')
      .eq('warehouse_id', warehouseId)
      .eq('product_id', productId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current stock:', fetchError);
      return false;
    }

    const availableStock = (currentStock?.stock_quantity || 0) - (currentStock?.reserved_quantity || 0);
    
    if (availableStock < quantity) {
      console.error('❌ Insufficient stock available');
      return false;
    }

    // Update the inventory
    const { error: updateError } = await supabase
      .from('warehouse_products')
      .update({
        stock_quantity: (currentStock?.stock_quantity || 0) - quantity,
        last_updated: new Date().toISOString()
      })
      .eq('warehouse_id', warehouseId)
      .eq('product_id', productId);

    if (updateError) {
      console.error('❌ Error updating inventory:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Update inventory on sale error:', error);
    return false;
  }
}

export async function upsertWarehouseProductStock(stockUpdates: Array<{ 
  warehouseId: string; 
  productId: string; 
  stockQuantity: number;
  reservedQuantity?: number;
  reorderLevel?: number;
}>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  // Convert to the format expected by the database
  const entries = stockUpdates.map(update => ({
    warehouse_id: update.warehouseId,
    product_id: update.productId,
    stock_quantity: update.stockQuantity,
    reserved_quantity: update.reservedQuantity || 0,
    reorder_level: update.reorderLevel || 0,
  }));

  const { error } = await supabase
    .from('warehouse_products')
    .upsert(entries, { onConflict: 'warehouse_id,product_id' });

  if (error) {
    console.error('❌ Upsert warehouse stock error:', error);
    return false;
  }
  return true;
}


// Update warehouse
export async function updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<Warehouse | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot update warehouse.');
  }

  try {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.state !== undefined) updateData.state = updates.state;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.contactPhone !== undefined) updateData.contact_phone = updates.contactPhone;
    if (updates.contactEmail !== undefined) updateData.contact_email = updates.contactEmail;
    if (updates.mapLink !== undefined) updateData.map_link = updates.mapLink;
    if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.isAvailable !== undefined) updateData.is_available = updates.isAvailable;

    const { data, error } = await supabase
      .from('warehouses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw new Error(`Database update failed: ${error.message}`);
    }

    return mapSupabaseRowToWarehouse(data);
  } catch (error) {
    console.error('❌ Update warehouse error:', error);
    throw error;
  }
}

// Delete warehouse
export async function deleteWarehouse(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot delete warehouse.');
  }

  try {
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      throw new Error(`Database delete failed: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Delete warehouse error:', error);
    throw error;
  }
}

// Get warehouse by ID
export async function getWarehouseById(id: string): Promise<Warehouse | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot fetch warehouse.');
  }

  try {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      throw new Error(`Database fetch failed: ${error.message}`);
    }

    return mapSupabaseRowToWarehouse(data);
  } catch (error) {
    console.error('❌ Get warehouse error:', error);
    throw error;
  }
}
