import { NextRequest, NextResponse } from 'next/server';
import { Polar } from "@polar-sh/sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    async function run() {
      const result = await polar.subscriptions.update({
        id: params.id,
        subscriptionUpdate: {},
      });

      // Handle the result
      console.log(result);
      return result;
    }

    const result = await run();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription', details: error.message },
      { status: 500 }
    );
  }
} 