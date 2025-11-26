"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Truck, 
  Clock, 
  DollarSign,
  User,
  Package,
  Route,
  Calendar,
  Phone,
  Navigation
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { formatPrice } from "@/lib/products-client";

interface DeliveryZone {
  id: string;
  name: string;
  areas: string[];
  basePrice: number;
  estimatedDays: string;
  isActive: boolean;
  restrictions: string[];
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  status: 'available' | 'busy' | 'offline';
  currentZone: string;
  deliveriesToday: number;
  rating: number;
}

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  zone: string;
  driverId: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'failed';
  scheduledDate: string;
  deliveredDate?: string;
  notes: string;
}

function LogisticsContent() {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeTab, setActiveTab] = useState<'zones' | 'drivers' | 'deliveries'>('zones');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogisticsData();
  }, []);

  const loadLogisticsData = async () => {
    // Simulate logistics data
    const mockZones: DeliveryZone[] = [
      {
        id: "ZONE-001",
        name: "Lagos Island",
        areas: ["Victoria Island", "Ikoyi", "Lagos Island", "Lekki Phase 1"],
        basePrice: 5000,
        estimatedDays: "1-2 days",
        isActive: true,
        restrictions: ["No weekend deliveries to some areas"]
      },
      {
        id: "ZONE-002",
        name: "Lagos Mainland",
        areas: ["Ikeja", "Surulere", "Yaba", "Maryland", "Gbagada"],
        basePrice: 7500,
        estimatedDays: "1-3 days",
        isActive: true,
        restrictions: []
      },
      {
        id: "ZONE-003",
        name: "Abuja Central",
        areas: ["Garki", "Wuse", "Maitama", "Asokoro"],
        basePrice: 12000,
        estimatedDays: "2-4 days",
        isActive: true,
        restrictions: ["Requires advance scheduling"]
      },
      {
        id: "ZONE-004",
        name: "Port Harcourt",
        areas: ["GRA", "Old GRA", "D-Line", "Trans Amadi"],
        basePrice: 15000,
        estimatedDays: "3-5 days",
        isActive: true,
        restrictions: ["Limited to weekdays only"]
      }
    ];

    const mockDrivers: Driver[] = [
      {
        id: "DRV-001",
        name: "Emeka Okafor",
        phone: "+234 801 111 2222",
        vehicle: "Toyota Hiace",
        plateNumber: "LAG-123-AB",
        status: "available",
        currentZone: "Lagos Island",
        deliveriesToday: 3,
        rating: 4.8
      },
      {
        id: "DRV-002",
        name: "Aisha Mohammed",
        phone: "+234 803 333 4444",
        vehicle: "Iveco Daily",
        plateNumber: "ABJ-456-CD",
        status: "busy",
        currentZone: "Abuja Central",
        deliveriesToday: 2,
        rating: 4.9
      },
      {
        id: "DRV-003",
        name: "Tunde Adebayo",
        phone: "+234 805 555 6666",
        vehicle: "Mercedes Sprinter",
        plateNumber: "LAG-789-EF",
        status: "available",
        currentZone: "Lagos Mainland",
        deliveriesToday: 1,
        rating: 4.7
      }
    ];

    const mockDeliveries: Delivery[] = [
      {
        id: "DEL-001",
        orderId: "ORD-001",
        customerName: "Adebayo Johnson",
        customerPhone: "+234 801 234 5678",
        address: "15 Victoria Island, Lagos",
        zone: "Lagos Island",
        driverId: "DRV-001",
        status: "scheduled",
        scheduledDate: "2024-01-18",
        notes: "Customer requested morning delivery"
      },
      {
        id: "DEL-002",
        orderId: "ORD-002",
        customerName: "Fatima Abdullahi",
        customerPhone: "+234 803 456 7890",
        address: "Plot 123 Garki, Abuja",
        zone: "Abuja Central",
        driverId: "DRV-002",
        status: "in_transit",
        scheduledDate: "2024-01-17",
        notes: "Large furniture items - requires assembly"
      },
      {
        id: "DEL-003",
        orderId: "ORD-003",
        customerName: "Chinedu Okafor",
        customerPhone: "+234 805 678 9012",
        address: "Corporate Plaza, Port Harcourt",
        zone: "Port Harcourt",
        driverId: "DRV-003",
        status: "delivered",
        scheduledDate: "2024-01-16",
        deliveredDate: "2024-01-16",
        notes: "Corporate delivery completed successfully"
      }
    ];

    setDeliveryZones(mockZones);
    setDrivers(mockDrivers);
    setDeliveries(mockDeliveries);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'offline': return 'secondary';
      case 'scheduled': return 'secondary';
      case 'in_transit': return 'default';
      case 'delivered': return 'default';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const logisticsStats = {
    totalZones: deliveryZones.length,
    activeZones: deliveryZones.filter(z => z.isActive).length,
    totalDrivers: drivers.length,
    availableDrivers: drivers.filter(d => d.status === 'available').length,
    scheduledDeliveries: deliveries.filter(d => d.status === 'scheduled').length,
    inTransitDeliveries: deliveries.filter(d => d.status === 'in_transit').length,
    deliveredToday: deliveries.filter(d => d.status === 'delivered' && d.deliveredDate === '2024-01-16').length,
    averageDeliveryTime: "2.3 days"
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading logistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Logistics Management</h1>
          <p className="text-muted-foreground">
            Manage delivery zones, drivers, and shipments across Nigeria
          </p>
        </div>

        {/* Logistics Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Zones</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsStats.totalZones}</div>
              <p className="text-xs text-muted-foreground">
                {logisticsStats.activeZones} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drivers</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsStats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                {logisticsStats.availableDrivers} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsStats.scheduledDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                {logisticsStats.inTransitDeliveries} in transit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logisticsStats.deliveredToday}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {logisticsStats.averageDeliveryTime}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('zones')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'zones'
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="h-4 w-4 inline mr-2" />
            Delivery Zones
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'drivers'
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Truck className="h-4 w-4 inline mr-2" />
            Drivers
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'deliveries'
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Deliveries
          </button>
        </div>

        {/* Delivery Zones Tab */}
        {activeTab === 'zones' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Delivery Zones</CardTitle>
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{zone.name}</h3>
                        <Badge variant={zone.isActive ? 'default' : 'secondary'}>
                          {zone.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Areas:</span>
                          <p>{zone.areas.join(', ')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Base Price:</span>
                          <p>{formatPrice(zone.basePrice)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Delivery Time:</span>
                          <p>{zone.estimatedDays}</p>
                        </div>
                      </div>
                      
                      {zone.restrictions.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-orange-600">Restrictions:</span>
                          <p className="text-sm text-orange-600">{zone.restrictions.join(', ')}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">
                        <Route className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Delivery Drivers</CardTitle>
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{driver.name}</h3>
                        <Badge variant={getStatusColor(driver.status) as any}>
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">⭐ {driver.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{driver.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          <span>{driver.vehicle} ({driver.plateNumber})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{driver.currentZone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>{driver.deliveriesToday} deliveries today</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scheduled Deliveries</CardTitle>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Delivery
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveries.map((delivery) => {
                  const driver = drivers.find(d => d.id === delivery.driverId);
                  return (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{delivery.orderId}</h3>
                          <Badge variant={getStatusColor(delivery.status) as any}>
                            {delivery.status.replace('_', ' ').charAt(0).toUpperCase() + delivery.status.replace('_', ' ').slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Customer:</span>
                            <p>{delivery.customerName}</p>
                            <p>{delivery.customerPhone}</p>
                          </div>
                          <div>
                            <span className="font-medium">Address:</span>
                            <p>{delivery.address}</p>
                            <p>{delivery.zone}</p>
                          </div>
                          <div>
                            <span className="font-medium">Driver:</span>
                            <p>{driver?.name}</p>
                            <p>Scheduled: {delivery.scheduledDate}</p>
                          </div>
                        </div>
                        
                        {delivery.notes && (
                          <div className="mt-2">
                            <span className="text-sm font-medium">Notes:</span>
                            <p className="text-sm text-muted-foreground">{delivery.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Navigation className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LogisticsPage() {
  return (
    <ProtectedRoute>
      <LogisticsContent />
    </ProtectedRoute>
  );
}