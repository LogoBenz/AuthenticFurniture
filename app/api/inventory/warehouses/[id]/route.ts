import { NextRequest, NextResponse } from 'next/server';
import { updateWarehouse, deleteWarehouse } from '@/lib/warehouses';

// PUT /api/inventory/warehouses/[id] - Update warehouse
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, state, address, contactPhone, contactEmail, mapLink, capacity, notes, isAvailable } = body;

    if (!name || !state) {
      return NextResponse.json(
        { error: 'Name and state are required' },
        { status: 400 }
      );
    }

    const warehouse = await updateWarehouse(params.id, {
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
        { error: 'Failed to update warehouse' },
        { status: 500 }
      );
    }

    return NextResponse.json({ warehouse });
  } catch (error) {
    console.error('❌ Error updating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to update warehouse' },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/warehouses/[id] - Delete warehouse
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteWarehouse(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete warehouse' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to delete warehouse' },
      { status: 500 }
    );
  }
}
