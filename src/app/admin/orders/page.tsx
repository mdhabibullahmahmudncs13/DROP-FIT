'use client';

import { useEffect, useState, useMemo } from 'react';
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite/client';
import { formatDate, formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import { OrderItem } from '@/types/order';
import { Query } from 'appwrite';
import { useDebounce, useExportData } from '@/hooks/useAdminUtils';
import { useAdminToast } from '@/app/admin/layout';
import Button from '@/components/ui/Button';

type AdminOrder = {
  $id: string;
  items: string;
  total_amount: number;
  status: string;
  created_at?: string;
  $createdAt: string;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_info?: string;
};

function safeParseItems(items: string): OrderItem[] {
  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getShipping(order: AdminOrder): { name: string; phone: string; address: string; city: string } {
  if (order.shipping_name || order.shipping_phone || order.shipping_address || order.shipping_city) {
    return {
      name: order.shipping_name || 'Unknown',
      phone: order.shipping_phone || 'N/A',
      address: order.shipping_address || 'N/A',
      city: order.shipping_city || 'N/A',
    };
  }

  if (order.shipping_info) {
    try {
      const parsed = JSON.parse(order.shipping_info);
      return {
        name: parsed?.name || 'Unknown',
        phone: parsed?.phone || 'N/A',
        address: parsed?.address || 'N/A',
        city: parsed?.city || 'N/A',
      };
    } catch {
      return { name: 'Unknown', phone: 'N/A', address: 'N/A', city: 'N/A' };
    }
  }

  return { name: 'Unknown', phone: 'N/A', address: 'N/A', city: 'N/A' };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const toast = useAdminToast();
  const { exportToCSV } = useExportData();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), Query.limit(200)]
      );
      setOrders(response.documents as unknown as AdminOrder[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderId,
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.$id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === 'all' || order.status === filter;
      if (!debouncedSearch) return matchesFilter;
      
      const searchLower = debouncedSearch.toLowerCase();
      const shipping = getShipping(order);
      const matchesSearch = 
        order.$id.toLowerCase().includes(searchLower) ||
        shipping.name.toLowerCase().includes(searchLower) ||
        shipping.phone.includes(searchLower) ||
        order.total_amount.toString().includes(searchLower);
      
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, debouncedSearch]);

  const handleExport = () => {
    const exportData = filteredOrders.map((order) => {
      const shipping = getShipping(order);
      const items = safeParseItems(order.items);
      return {
        OrderID: order.$id,
        Customer: shipping.name,
        Phone: shipping.phone,
        Address: `${shipping.address}, ${shipping.city}`,
        Items: items.length,
        Amount: order.total_amount,
        Status: order.status,
        Date: formatDate(order.$createdAt),
      };
    });
    exportToCSV(exportData, 'orders');
    toast.success('Orders exported successfully');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'confirmed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Orders Management</h2>
          <p className="text-text-secondary">View and process customer orders</p>
        </div>
        <Button onClick={handleExport} variant="secondary" disabled={filteredOrders.length === 0}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-background-surface rounded-card border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, customer name, or phone..."
              className="w-full px-4 py-2 bg-background-card border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-background-hover text-text-secondary hover:bg-background-card'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-3 text-sm text-text-muted">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const items = safeParseItems(order.items);
          const shipping = getShipping(order);
          const createdAt = order.created_at || order.$createdAt;

          return (
            <div
              key={order.$id}
              className="bg-background-surface rounded-card border border-border p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    Order #{order.$id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-text-secondary">{formatDate(createdAt)}</p>
                </div>
                <Badge variant={getStatusVariant(order.status)} size="md">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Customer</p>
                  <p className="text-text-primary font-medium">{shipping.name}</p>
                  <p className="text-sm text-text-secondary">{shipping.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Shipping Address</p>
                  <p className="text-text-primary">{shipping.address}</p>
                  <p className="text-text-secondary">{shipping.city}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(order.total_amount)}</p>
                  <p className="text-sm text-text-secondary">{items.length} item(s)</p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-background-card rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-text-secondary mb-3">Order Items:</p>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-text-primary">
                        {item.title} <span className="text-text-muted">(Size: {item.size}, Qty: {item.qty})</span>
                      </span>
                      <span className="text-primary font-semibold">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.$id, e.target.value)}
                  className="px-4 py-2 bg-background-hover text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-background-surface rounded-card border border-border">
          <p className="text-text-secondary">No orders found</p>
        </div>
      )}
    </div>
  );
}
