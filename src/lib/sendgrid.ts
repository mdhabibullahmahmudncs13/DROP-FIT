import sgMail from '@sendgrid/mail';
import { OrderItem } from '@/types/order';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'no-reply@dropfit.com';

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Welcome to Drop Fit 🔥',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #0F0F0F; color: #FFFFFF; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 700; color: #E63946; }
            .content { background-color: #1A1A1A; border-radius: 12px; padding: 30px; border: 1px solid #2E2E2E; }
            .greeting { font-size: 24px; font-weight: 600; margin-bottom: 20px; }
            .text { font-size: 16px; line-height: 1.6; color: #A3A3A3; margin-bottom: 15px; }
            .cta { display: inline-block; background-color: #E63946; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666666; }
            .social { margin-top: 20px; }
            .social a { color: #E63946; text-decoration: none; margin: 0 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">DROP FIT</div>
            </div>
            <div class="content">
              <div class="greeting">Welcome to Drop Fit, ${name}! 🔥</div>
              <p class="text">
                You're now part of the exclusive Drop Fit community — where fandom meets fashion.
              </p>
              <p class="text">
                We create limited-edition anime and series streetwear that you won't find anywhere else. 
                Each drop is exclusive, and once it's gone, it's gone forever.
              </p>
              <p class="text">
                Get ready to upgrade your fit with premium fabrics, fade-resistant prints, and oversized styles 
                that let you wear your passion proudly.
              </p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shop" class="cta">
                Start Shopping
              </a>
            </div>
            <div class="footer">
              <p>Follow us for drops, restocks & exclusive content</p>
              <div class="social">
                <a href="#">Instagram</a> | 
                <a href="#">Facebook</a> | 
                <a href="#">TikTok</a>
              </div>
              <p style="margin-top: 20px;">Drop Fit © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderData: {
    orderId: string;
    name: string;
    items: OrderItem[];
    total: number;
    address: string;
    city: string;
  }
): Promise<void> {
  const itemsHtml = orderData.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #2E2E2E;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #2E2E2E; text-align: center;">${item.size}</td>
        <td style="padding: 10px; border-bottom: 1px solid #2E2E2E; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #2E2E2E; text-align: right;">৳${item.price * item.qty}</td>
      </tr>
    `
    )
    .join('');

  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Your Drop Fit Order is Confirmed! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #0F0F0F; color: #FFFFFF; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 700; color: #E63946; }
            .content { background-color: #1A1A1A; border-radius: 12px; padding: 30px; border: 1px solid #2E2E2E; }
            .greeting { font-size: 24px; font-weight: 600; margin-bottom: 20px; }
            .text { font-size: 16px; line-height: 1.6; color: #A3A3A3; margin-bottom: 15px; }
            .order-id { background-color: #242424; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #242424; padding: 12px; text-align: left; font-weight: 600; }
            .total { font-size: 20px; font-weight: 700; color: #E63946; text-align: right; margin-top: 20px; }
            .info-box { background-color: #242424; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .info-label { color: #666666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
            .info-value { font-size: 16px; color: #FFFFFF; }
            .cta { display: inline-block; background-color: #E63946; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666666; }
            .cod-notice { background-color: #2E2E2E; border-left: 4px solid #E63946; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">DROP FIT</div>
            </div>
            <div class="content">
              <div class="greeting">Order Confirmed! 🎉</div>
              <p class="text">Hey ${orderData.name}, your Drop Fit order has been confirmed and is being processed.</p>
              
              <div class="order-id">Order ID: ${orderData.orderId}</div>
              
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Size</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div class="total">Total: ৳${orderData.total}</div>
              
              <div class="cod-notice">
                <strong>💵 Payment Method: Cash on Delivery (COD)</strong><br>
                You will pay when your order is delivered to your doorstep.
              </div>
              
              <div class="info-box">
                <div class="info-label">Delivery Address</div>
                <div class="info-value">${orderData.address}, ${orderData.city}</div>
              </div>
              
              <p class="text">
                We'll send you updates as your order moves through processing, shipping, and delivery. 
                You can track your order anytime using the link below.
              </p>
              
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track-order/${orderData.orderId}" class="cta">
                Track Your Order
              </a>
            </div>
            <div class="footer">
              <p>Questions? Reply to this email or contact us on Instagram</p>
              <p style="margin-top: 20px;">Drop Fit © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

export async function sendDropNotificationEmail(
  recipients: string[],
  dropData: {
    title: string;
    description: string;
    dropUrl: string;
  }
): Promise<void> {
  const msg = {
    to: recipients,
    from: FROM_EMAIL,
    subject: '🔥 New Drop is LIVE — Don\'t Miss Out!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #0F0F0F; color: #FFFFFF; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 700; color: #E63946; }
            .content { background-color: #1A1A1A; border-radius: 12px; padding: 30px; border: 1px solid #2E2E2E; }
            .title { font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center; color: #E63946; }
            .text { font-size: 16px; line-height: 1.6; color: #A3A3A3; margin-bottom: 15px; }
            .cta { display: inline-block; background-color: #E63946; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; margin-top: 20px; font-size: 18px; }
            .urgency { background-color: #2E2E2E; border-left: 4px solid #E63946; padding: 15px; margin: 20px 0; text-align: center; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">DROP FIT</div>
            </div>
            <div class="content">
              <div class="title">🔥 ${dropData.title}</div>
              <p class="text">${dropData.description}</p>
              
              <div class="urgency">
                ⚡ Limited Stock — Once It's Gone, It's Gone Forever
              </div>
              
              <p class="text" style="text-align: center;">
                This is your chance to own exclusive streetwear that won't restock. 
                Don't sleep on this drop.
              </p>
              
              <div style="text-align: center;">
                <a href="${dropData.dropUrl}" class="cta">
                  Shop The Drop Now
                </a>
              </div>
            </div>
            <div class="footer">
              <p>You're receiving this because you signed up for drop notifications</p>
              <p style="margin-top: 20px;">Drop Fit © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending drop notification emails:', error);
    throw error;
  }
}
