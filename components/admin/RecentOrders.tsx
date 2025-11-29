"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";
import { formatPrice } from "@/lib/db";
import Link from "next/link";
import { Eye } from "lucide-react";

interface RecentOrdersProps {
    orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    // Take only the last 5 orders
    const recentOrders = [...orders].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500 hover:bg-green-600';
            case 'processing': return 'bg-blue-500 hover:bg-blue-600';
            case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'cancelled': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/admin/orders">
                    <Button variant="outline" size="sm">View All</Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}</td>
                                        <td className="px-4 py-3">
                                            {order.shipping_address?.fullName || 'Guest'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
