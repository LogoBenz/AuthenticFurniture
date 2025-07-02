"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Eye,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Truck
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getAllOrders, formatPrice } from "@/lib/db";
import { Order } from "@/types";

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrdersData();
  }, []);

  const loadOrdersData = async () => {
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'processing': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'partial': return 'secondary';
      case 'paid': return 'default';
      case 'refunded': return 'destructive';
      default: return 'secondary';
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalValue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingPayments: orders.filter(o => o.paymentStatus === 'pending').length
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders and deliveries
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {orderStats.pending} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(orderStats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Total revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.processing}</div>
              <p className="text-xs text-muted-foreground">
                Being prepared
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <XCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{orderStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Need follow-up
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-medium">{order.id}</h3>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{order.deliveryZone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{order.orderDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right mr-4">
                    <div className="font-medium">{formatPrice(order.total)}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t mt-3">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <h3 className="font-medium mb-3">Order Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Order Status:</span>
                      <div className="mt-1">
                        <Badge variant={getStatusColor(selectedOrder.status) as any}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Status:</span>
                      <div className="mt-1">
                        <Badge variant={getPaymentStatusColor(selectedOrder.paymentStatus) as any}>
                          {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Method:</span>
                      <p className="font-medium">{selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Delivery:</span>
                      <p className="font-medium">{selectedOrder.expectedDelivery || 'TBD'}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-medium mb-3">Notes</h3>
                    <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Update Status</Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Truck className="h-4 w-4 mr-2" />
                    Schedule Delivery
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}