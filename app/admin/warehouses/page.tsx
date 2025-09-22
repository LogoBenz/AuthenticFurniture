'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Warehouse } from '@/types';

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    mapLink: '',
    capacity: '',
    notes: '',
    isAvailable: true,
  });

  // Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/inventory/warehouses');
        if (response.ok) {
          const { warehouses } = await response.json();
          setWarehouses(warehouses || []);
        } else {
          toast.error('Failed to fetch warehouses');
        }
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        toast.error('Failed to fetch warehouses');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      state: '',
      address: '',
      contactPhone: '',
      contactEmail: '',
      mapLink: '',
      capacity: '',
      notes: '',
      isAvailable: true,
    });
    setEditingWarehouse(null);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      state: warehouse.state,
      address: warehouse.address || '',
      contactPhone: warehouse.contactPhone || '',
      contactEmail: warehouse.contactEmail || '',
      mapLink: warehouse.mapLink || '',
      capacity: warehouse.capacity?.toString() || '',
      notes: warehouse.notes || '',
      isAvailable: warehouse.isAvailable,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.state.trim()) {
      toast.error('Name and state are required');
      return;
    }

    try {
      setSaving(true);
      
      const warehouseData = {
        name: formData.name.trim(),
        state: formData.state.trim(),
        address: formData.address.trim() || null,
        contactPhone: formData.contactPhone.trim() || null,
        contactEmail: formData.contactEmail.trim() || null,
        mapLink: formData.mapLink.trim() || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        notes: formData.notes.trim() || null,
        isAvailable: formData.isAvailable,
      };

      const response = await fetch('/api/inventory/warehouses', {
        method: editingWarehouse ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingWarehouse?.id,
          ...warehouseData,
        }),
      });

      if (response.ok) {
        const { warehouse } = await response.json();
        
        if (editingWarehouse) {
          setWarehouses(prev => 
            prev.map(w => w.id === editingWarehouse.id ? warehouse : w)
          );
          toast.success('Warehouse updated successfully');
        } else {
          setWarehouses(prev => [...prev, warehouse]);
          toast.success('Warehouse created successfully');
        }
        
        setIsDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save warehouse');
      }
    } catch (error) {
      console.error('Error saving warehouse:', error);
      toast.error('Failed to save warehouse');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (warehouse: Warehouse) => {
    if (!confirm(`Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🔄 Deleting warehouse:', warehouse.id);
      
      const response = await fetch(`/api/inventory/warehouses/${warehouse.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Delete response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Delete successful:', result);
        
        // Remove from UI state
        setWarehouses(prev => prev.filter(w => w.id !== warehouse.id));
        toast.success('Warehouse deleted successfully');
        
        // Refresh data from server to ensure consistency
        setTimeout(async () => {
          try {
            const refreshResponse = await fetch('/api/inventory/warehouses');
            if (refreshResponse.ok) {
              const { warehouses: refreshedWarehouses } = await refreshResponse.json();
              setWarehouses(refreshedWarehouses || []);
              console.log('✅ Data refreshed after deletion');
            }
          } catch (refreshError) {
            console.error('❌ Error refreshing data:', refreshError);
          }
        }, 1000);
      } else {
        const error = await response.json();
        console.error('❌ Delete failed:', error);
        toast.error(error.error || 'Failed to delete warehouse');
      }
    } catch (error) {
      console.error('❌ Error deleting warehouse:', error);
      toast.error('Failed to delete warehouse');
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedWarehouses = filteredWarehouses.reduce((acc, warehouse) => {
    if (!acc[warehouse.state]) {
      acc[warehouse.state] = [];
    }
    acc[warehouse.state].push(warehouse);
    return acc;
  }, {} as Record<string, Warehouse[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground">Manage your warehouse locations and inventory</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Warehouse Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Ikeja Main Warehouse"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="e.g., Lagos"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Full warehouse address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+234 800 000 0000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="warehouse@company.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapLink">Map Link</Label>
                <Input
                  id="mapLink"
                  value={formData.mapLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, mapLink: e.target.value }))}
                  placeholder="Google Maps or other map service URL"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity (optional)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="Maximum storage capacity"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                  />
                  <Label htmlFor="isAvailable">Available for new stock</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this warehouse"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {editingWarehouse ? 'Update' : 'Create'} Warehouse
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search warehouses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Warehouses grouped by state */}
      {Object.keys(groupedWarehouses).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? 'No warehouses found matching your search.' : 'No warehouses found. Create your first warehouse to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedWarehouses).map(([state, stateWarehouses]) => (
            <Card key={state}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {state}
                  <Badge variant="secondary" className="ml-2">
                    {stateWarehouses.length} warehouse{stateWarehouses.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stateWarehouses.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{warehouse.name}</h3>
                          <Badge variant={warehouse.isAvailable ? 'default' : 'destructive'}>
                            {warehouse.isAvailable ? 'Available' : 'Full'}
                          </Badge>
                        </div>
                        
                        {warehouse.address && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {warehouse.address}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          {warehouse.contactPhone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {warehouse.contactPhone}
                            </div>
                          )}
                          {warehouse.contactEmail && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {warehouse.contactEmail}
                            </div>
                          )}
                          {warehouse.mapLink && (
                            <a
                              href={warehouse.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center hover:text-primary"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View on Map
                            </a>
                          )}
                        </div>
                        
                        {warehouse.capacity && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Capacity: {warehouse.capacity.toLocaleString()} units
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(warehouse)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(warehouse)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}