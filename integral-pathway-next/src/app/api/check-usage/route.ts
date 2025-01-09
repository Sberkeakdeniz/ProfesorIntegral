import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createRouteHandlerClient({ cookies });

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get usage count using the database function
        const { data: usageCount, error } = await supabase
            .rpc('get_user_usage', {
                user_id: session.user.id,
                start_date: today.toISOString(),
                end_date: tomorrow.toISOString()
            });

        if (error) {
            console.error('Error checking usage:', error);
            return NextResponse.json(
                { error: 'Failed to check usage' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            usageCount: usageCount || 0,
            resetTime: tomorrow.getTime()
        });
    } catch (error) {
        console.error('Error in check-usage:', error);
        return NextResponse.json(
            { error: 'Failed to check usage status' },
            { status: 500 }
        );
    }
} 