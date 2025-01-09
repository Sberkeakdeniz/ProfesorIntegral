import { api } from '@/lib/polar';
import { NextRequest, NextResponse } from 'next/server';

async function handleCheckout(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const priceId = url.searchParams.get('priceId');

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get the base URL for the success redirect
    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    
    // Create a checkout session with Polar
    const result = await api.checkouts.custom.create({
      productPriceId: priceId,
      successUrl: `${baseUrl}/confirmation?checkout_id={CHECKOUT_ID}`,
    });

    // Return the checkout URL instead of redirecting
    return NextResponse.json({ url: result.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Support both GET and POST methods
export const GET = handleCheckout;
export const POST = handleCheckout; 