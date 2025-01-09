import { NextRequest, NextResponse } from 'next/server';
import { Polar } from "@polar-sh/sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Define the route handler type
type RouteHandler = (
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) => Promise<Response>;

// Implement the route handler
export const PATCH: RouteHandler = async (req, context) => {
    try {
        // Get the current user's session
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        const params = await context.params;
        const polar = new Polar({
            accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
        });

        const result = await polar.subscriptions.update({
            id: params.id,
            subscriptionUpdate: {},
        });

        return Response.json({ success: true, result });
    } catch (error: any) {
        console.error('Error updating subscription:', error);
        return Response.json(
            { error: 'Failed to update subscription', details: error.message },
            { status: 500 }
        );
    }
} 