import { NextRequest, NextResponse } from 'next/server';
import { updateWarehouse, deleteWarehouse } from '@/lib/warehouses';

// PUT /api/inventory/warehouses/[id] - Update warehouse
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, state, address, contactPhone, contactEmail, mapLink, capacity, notes, isAvailable } = body;

    if (!name || !state) {
      return NextResponse.json(
        { error: 'Name and state are required' },
        { status: 400 }
      );
    }

    const warehouse = await updateWarehouse(id, {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔄 API: Deleting warehouse with ID:', id);
    
    // Validate ID
    if (!id || id.trim() === '') {
      console.error('❌ Invalid warehouse ID provided');
      return NextResponse.json(
        { error: 'Invalid warehouse ID' },
        { status: 400 }
      );
    }

    const success = await deleteWarehouse(id);

    if (!success) {
      console.error('❌ Warehouse deletion failed in database');
      return NextResponse.json(
        { error: 'Failed to delete warehouse from database' },
        { status: 500 }
      );
    }

    console.log('✅ Warehouse deleted successfully:', id);
    return NextResponse.json({ 
      success: true, 
      message: 'Warehouse deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('❌ Error deleting warehouse:', error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to delete warehouse',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
