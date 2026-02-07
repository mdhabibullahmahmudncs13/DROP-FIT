import { NextRequest, NextResponse } from 'next/server';
import { addToNotifyList } from '@/lib/appwrite/notify';
import { sendWelcomeEmail } from '@/lib/sendgrid';
import { validateEmail } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Add to notify list
    await addToNotifyList(email, name);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name || 'Drop Fit Fan');
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
