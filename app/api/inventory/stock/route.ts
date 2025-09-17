import { NextRequest, NextResponse } from 'next/server';
import { getInventoryByWarehouse, upsertWarehouseProductStock } from '@/lib/warehouses';

// GET /api/inventory/stock?warehouseId=xxx - Get stock for specific warehouse
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');

    if (!warehouseId) {
      return NextResponse.json(
        { error: 'warehouseId parameter is required' },
        { status: 400 }
      );
    }

    const inventory = await getInventoryByWarehouse(warehouseId);
    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('❌ Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/stock - Upsert stock for multiple products/warehouses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stockUpdates } = body;

    if (!Array.isArray(stockUpdates) || stockUpdates.length === 0) {
      return NextResponse.json(
        { error: 'stockUpdates array is required' },
        { status: 400 }
      );
    }

    // Validate each stock update
    for (const update of stockUpdates) {
      if (!update.warehouseId || !update.productId || typeof update.stockQuantity !== 'number') {
        return NextResponse.json(
          { error: 'Each stock update must have warehouseId, productId, and stockQuantity' },
          { status: 400 }
        );
      }
    }

    const results = await upsertWarehouseProductStock(stockUpdates);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('❌ Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}
