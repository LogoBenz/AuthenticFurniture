"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  Star,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Eye,
  Edit,
  AlertCircle
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getAllCustomers, formatPrice } from "@/lib/db";
import { Customer } from "@/types";
import { AddCustomerModal } from "@/components/customers/AddCustomerModal";
import { Alert, AlertDescription } from "@/components/ui/alert";

function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const checkSupabaseConfig = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      return !!(supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '' && supabaseUrl.includes('supabase.co'));
    };
    
    setIsSupabaseConfigured(checkSupabaseConfig());
    loadCustomersData();
  }, []);

  const loadCustomersData = async () => {
    try {
      const customersData = await getAllCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerAdded = () => {
    // Reload customers data after adding a new customer
    loadCustomersData();
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = customerTypeFilter === "all" || customer.customerType === customerTypeFilter;
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'default';
      case 'bulk': return 'secondary';
      case 'corporate': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'vip': return 'default';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  const customerStats = {
    total: customers.length,
    retail: customers.filter(c => c.customerType === 'retail').length,
    bulk: customers.filter(c => c.customerType === 'bulk').length,
    corporate: customers.filter(c => c.customerType === 'corporate').length,
    vip: customers.filter(c => c.status === 'vip').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrderValue: customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length || 0
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading customers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer relationships and communication history
          </p>
        </div>

        {/* Supabase Configuration Alert */}
        {!isSupabaseConfigured && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Database Setup Required:</strong> You're viewing sample data. To add and manage real customers, please configure your Supabase database connection.
            </AlertDescription>
          </Alert>
        )}

        {/* Customer Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {customerStats.vip} VIP customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(customerStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                From all customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(customerStats.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                Per customer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Corporate Clients</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.corporate}</div>
              <p className="text-xs text-muted-foreground">
                Business accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="retail">Retail</option>
                <option value="bulk">Bulk</option>
                <option value="corporate">Corporate</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button 
                onClick={() => setIsAddCustomerModalOpen(true)}
                disabled={!isSupabaseConfigured}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      <Badge variant={getCustomerTypeColor(customer.customerType) as any}>
                        {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
                      </Badge>
                      <Badge variant={getStatusColor(customer.status) as any}>
                        {customer.status === 'vip' && <Star className="h-3 w-3 mr-1" />}
                        {customer.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{customer.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        <span>{customer.totalOrders} orders</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right mr-4">
                    <div className="font-medium">{formatPrice(customer.totalSpent)}</div>
                    <div className="text-sm text-muted-foreground">
                      Avg: {formatPrice(customer.averageOrderValue)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsCustomerModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No customers found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details Modal */}
        <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
            </DialogHeader>
            
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer ID:</span>
                        <p className="font-medium">{selectedCustomer.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">{selectedCustomer.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Customer Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="mt-1">
                          <Badge variant={getCustomerTypeColor(selectedCustomer.customerType) as any}>
                            {selectedCustomer.customerType.charAt(0).toUpperCase() + selectedCustomer.customerType.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="mt-1">
                          <Badge variant={getStatusColor(selectedCustomer.status) as any}>
                            {selectedCustomer.status === 'vip' && <Star className="h-3 w-3 mr-1" />}
                            {selectedCustomer.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Registration Date:</span>
                        <p className="font-medium">{selectedCustomer.registrationDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Order:</span>
                        <p className="font-medium">{selectedCustomer.lastOrderDate || 'No orders yet'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase History */}
                <div>
                  <h3 className="font-medium mb-3">Purchase History</h3>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedCustomer.totalOrders}</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatPrice(selectedCustomer.totalSpent)}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatPrice(selectedCustomer.averageOrderValue)}</div>
                      <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    </div>
                  </div>
                </div>

                {/* Communication History */}
                <div>
                  <h3 className="font-medium mb-3">Communication History</h3>
                  <div className="space-y-3">
                    {selectedCustomer.communicationHistory.length > 0 ? (
                      selectedCustomer.communicationHistory.map((comm, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="mt-1">
                            {comm.type === 'call' && <Phone className="h-4 w-4 text-blue-500" />}
                            {comm.type === 'email' && <Mail className="h-4 w-4 text-green-500" />}
                            {comm.type === 'whatsapp' && <MessageCircle className="h-4 w-4 text-green-600" />}
                            {comm.type === 'visit' && <Users className="h-4 w-4 text-purple-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{comm.subject}</h4>
                              <span className="text-xs text-muted-foreground">{comm.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{comm.notes}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No communication history available.</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedCustomer.notes && (
                  <div>
                    <h3 className="font-medium mb-3">Notes</h3>
                    <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Customer Modal */}
        <AddCustomerModal
          isOpen={isAddCustomerModalOpen}
          onClose={() => setIsAddCustomerModalOpen(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <CustomersContent />
    </ProtectedRoute>
  );
}