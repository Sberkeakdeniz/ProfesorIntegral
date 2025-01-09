import { NextRequest, NextResponse } from 'next/server';
import { Polar } from "@polar-sh/sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
    });

    console.log('Fetching subscriptions for user:', session.user.email);

    // Use the subscriptions API to list all subscriptions
    const result = await polar.subscriptions.list({});
    const subscriptions = [];

    for await (const page of result) {
      if (page?.result?.items) {
        // Filter subscriptions by user email
        const userSubscriptions = page.result.items
          .filter(item => item.customer?.email === session.user.email)
          .map(item => ({
            id: item.id,
            status: item.status,
            product: {
              name: item.product?.name || 'Plus'
            },
            current_period_end: item.currentPeriodEnd,
            customer: {
              id: item.customer?.id,
              email: item.customer?.email
            }
          }));
        subscriptions.push(...userSubscriptions);
      }
    }

    console.log('Found subscriptions:', subscriptions);
    return NextResponse.json({ items: subscriptions });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
} 