import { ID, Query } from 'appwrite';
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from './client';
import { Order, OrderItem, ShippingInfo } from '@/types/order';

export interface CreateOrderData {
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping: ShippingInfo;
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  try {
    const orderData = {
      user_id: data.user_id,
      items: JSON.stringify(data.items),
      total_amount: data.total_amount,
      status: 'pending',
      shipping_name: data.shipping.name,
      shipping_phone: data.shipping.phone,
      shipping_address: data.shipping.address,
      shipping_city: data.shipping.city,
      payment_method: 'COD',
      notes: data.shipping.notes || '',
      created_at: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      orderData
    );

    return response as unknown as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId
    );
    return response as unknown as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal('user_id', userId), Query.orderDesc('created_at'), Query.limit(100)]
    );
    return response.documents as unknown as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
): Promise<void> {
  try {
    await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION_ID, orderId, {
      status,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
