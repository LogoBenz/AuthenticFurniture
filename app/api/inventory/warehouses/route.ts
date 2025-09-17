import { NextRequest, NextResponse } from 'next/server';
import { getAllWarehouses, createWarehouse } from '@/lib/warehouses';

// GET /api/inventory/warehouses - List all warehouses
export async function GET() {
  try {
    const warehouses = await getAllWarehouses();
    return NextResponse.json({ warehouses });
  } catch (error) {
    console.error('❌ Error fetching warehouses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouses' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/warehouses - Create new warehouse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, state, address, contactPhone, contactEmail, mapLink, capacity, notes, isAvailable } = body;

    if (!name || !state) {
      return NextResponse.json(
        { error: 'Name and state are required' },
        { status: 400 }
      );
    }

    const warehouse = await createWarehouse({
      name,
      state,
      address,
      contactPhone,
      contactEmail,
      mapLink,
      capacity,
      notes,
      isAvailable: isAvailable ?? true,
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: 'Failed to create warehouse' },
        { status: 500 }
      );
    }

    return NextResponse.json({ warehouse }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to create warehouse' },
      { status: 500 }
    );
  }
}
