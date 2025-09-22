import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/inventory/all - Get all inventory across all warehouses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');
    const productId = searchParams.get('productId');

    let query = supabase
      .from('warehouse_products')
      .select(`
        warehouse_id,
        product_id,
        stock_quantity,
        reserved_quantity,
        reorder_level,
        last_updated,
        products (
          id,
          name,
          model_no,
          price,
          images,
          in_stock
        ),
        warehouses (
          id,
          name,
          state,
          address
        )
      `)
      .order('last_updated', { ascending: false });

    // Filter by warehouse if specified
    if (warehouseId && warehouseId !== 'all') {
      query = query.eq('warehouse_id', warehouseId);
    }

    // Filter by product if specified
    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching all inventory:', error);
      
      // If table doesn't exist yet, return empty inventory
      if (error.code === '42703' || error.message.includes('does not exist')) {
        return NextResponse.json({ 
          inventory: [],
          totalProducts: 0,
          totalWarehouses: 0
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 }
      );
    }

    // Group inventory by product to show multi-warehouse support
    const groupedInventory = (data || []).reduce((acc: any, item: any) => {
      const productId = item.product_id;
      
      if (!acc[productId]) {
        acc[productId] = {
          product: item.products,
          warehouses: [],
          totalStock: 0,
          totalReserved: 0,
          totalAvailable: 0
        };
      }

      acc[productId].warehouses.push({
        id: `${item.warehouse_id}-${item.product_id}`, // Create composite ID
        warehouse_id: item.warehouse_id,
        product_id: item.product_id,
        warehouse: item.warehouses,
        stock_quantity: item.stock_quantity,
        reserved_quantity: item.reserved_quantity,
        reorder_level: item.reorder_level,
        last_updated: item.last_updated
      });

      acc[productId].totalStock += item.stock_quantity;
      acc[productId].totalReserved += item.reserved_quantity;
      acc[productId].totalAvailable += (item.stock_quantity - item.reserved_quantity);

      return acc;
    }, {});

    // Convert to array format
    const inventory = Object.values(groupedInventory);

    return NextResponse.json({ 
      inventory,
      totalProducts: inventory.length,
      totalWarehouses: new Set((data || []).map((item: any) => item.warehouse_id)).size
    });

  } catch (error) {
    console.error('❌ Error in inventory all API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
