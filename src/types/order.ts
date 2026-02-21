export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  title: string;
  size: string;
  qty: number;
  price: number;
}

export interface Order {
  $id: string;
  user_id: string;
  items: string; // JSON string of OrderItem[]
  total_amount: number;
  status: OrderStatus;
  shipping_info: string; // JSON string of ShippingInfo
  payment_method: string;
  drop_id: string | null; // ID of drop campaign if order is from a drop
  created_at: string;
}

export interface CartItem {
  product_id: string;
  title: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}
