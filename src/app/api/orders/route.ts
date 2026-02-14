import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProductStock } from '@/lib/appwrite/products';
import { createOrder } from '@/lib/appwrite/orders';
import { getCurrentUser } from '@/lib/appwrite/auth';
import { sendOrderConfirmationEmail } from '@/lib/sendgrid';
import { OrderItem } from '@/types/order';
import { calculateOrderTotal } from '@/lib/utils';
import { getDeliverySettings } from '@/lib/appwrite/settings';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { items, shipping } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    if (!shipping || !shipping.name || !shipping.phone || !shipping.address || !shipping.city) {
      return NextResponse.json({ error: 'Invalid shipping information' }, { status: 400 });
    }

    // Verify stock and calculate subtotal
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await getProductById(item.product_id);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.title}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 409 }
        );
      }

      orderItems.push({
        product_id: item.product_id,
        title: item.title,
        size: item.size,
        qty: item.quantity,
        price: item.price,
      });

      subtotal += item.price * item.quantity;
    }

    // Calculate delivery charge and total
    const deliverySettings = await getDeliverySettings();
    const orderCalculation = calculateOrderTotal(subtotal, shipping.city, deliverySettings);

    // Create order
    const order = await createOrder({
      user_id: user.$id,
      items: orderItems,
      total_amount: orderCalculation.total,
      shipping,
    });

    // Update stock for each product
    for (const item of items) {
      const product = await getProductById(item.product_id);
      if (product) {
        await updateProductStock(product.$id, product.stock - item.quantity);
      }
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(user.email, {
        orderId: order.$id,
        name: shipping.name,
        items: orderItems,
        total: orderCalculation.total,
        address: shipping.address,
        city: shipping.city,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
