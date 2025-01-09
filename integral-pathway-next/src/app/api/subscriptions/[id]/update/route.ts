import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { api } from '@/lib/polar';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { subscriptionUpdate } = body;

        const result = await api.subscriptions.update({
            id: params.id,
            subscriptionUpdate,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('[SUBSCRIPTION_UPDATE]', error);
        
        // Handle specific Polar API errors
        if (error.error === 'AlreadyCanceledSubscription') {
            return NextResponse.json({
                error: 'Subscription Update Failed',
                message: 'This subscription cannot be updated because it has already been canceled. Please start a new subscription.',
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Subscription Update Failed',
            message: 'An error occurred while updating your subscription. Please try again later.',
        }, { status: 500 });
    }
} 