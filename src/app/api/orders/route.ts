import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProductStock } from '@/lib/appwrite/products';
import { sendOrderConfirmationEmail } from '@/lib/sendgrid';
import { OrderItem } from '@/types/order';
import { calculateOrderTotal } from '@/lib/utils';
import { getDeliverySettings } from '@/lib/appwrite/settings';
import { serverDatabases } from '@/lib/appwrite/server-client';
import { DATABASE_ID, ORDERS_COLLECTION_ID } from '@/lib/appwrite/client';
import { ID } from 'node-appwrite';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { items, shipping, user_id, user_email } = body;

    console.log('Order request received:', { user_id, itemCount: items?.length, shipping: shipping?.city });

    // Validate required fields
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

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
      try {
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
      } catch (productError) {
        console.error('Error processing product:', item.product_id, productError);
        return NextResponse.json(
          { error: `Error verifying product: ${item.title}` },
          { status: 500 }
        );
      }
    }

    console.log('Order items validated, subtotal:', subtotal);

    // Calculate delivery charge and total
    let deliverySettings;
    try {
      deliverySettings = await getDeliverySettings();
      console.log('Delivery settings loaded:', deliverySettings);
    } catch (settingsError) {
      console.error('Error loading delivery settings:', settingsError);
      // Use default settings if loading fails
      deliverySettings = {
        baseCharge: 60,
        freeDeliveryThreshold: 2000,
        remoteAreaCharge: 40,
        remoteAreas: ['sylhet', 'chittagong', 'khulna', 'rajshahi', 'rangpur', 'barisal', 'mymensingh'],
      };
    }

    const orderCalculation = calculateOrderTotal(subtotal, shipping.city, deliverySettings);
    console.log('Order calculation:', orderCalculation);

    // Create order using server client
    let order;
    try {
      const orderData = {
        user_id: user_id,
        items: JSON.stringify(orderItems),
        total_amount: orderCalculation.total,
        status: 'pending',
        shipping_info: JSON.stringify({
          name: shipping.name,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          notes: shipping.notes || '',
        }),
        payment_method: 'COD',
        created_at: new Date().toISOString(),
      };

      order = await serverDatabases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        orderData
      );
      console.log('Order created:', order.$id);
    } catch (orderError) {
      console.error('Error creating order document:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      );
    }

    // Update stock for each product
    try {
      for (const item of items) {
        const product = await getProductById(item.product_id);
        if (product) {
          await updateProductStock(product.$id, product.stock - item.quantity);
        }
      }
      console.log('Stock updated for all products');
    } catch (stockError) {
      console.error('Error updating stock:', stockError);
      // Stock update failed, but order is created - log for manual review
    }

    // Send confirmation email
    if (user_email) {
      try {
        await sendOrderConfirmationEmail(user_email, {
          orderId: order.$id,
          name: shipping.name,
          items: orderItems,
          total: orderCalculation.total,
          address: shipping.address,
          city: shipping.city,
        });
        console.log('Order confirmation email sent to:', user_email);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the order if email fails
      }
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
