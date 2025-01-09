import { NextResponse } from 'next/server';
import { solveMathProblem } from '@/lib/openai';
import { MathProblemRequest, MathProblemResponse } from '@/types/math';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createRouteHandlerClient({ cookies });
        const body = await request.json();
        const { prompt, imageData } = body;

        if (!prompt && !imageData) {
            return NextResponse.json(
                { error: 'No prompt or image provided' },
                { status: 400 }
            );
        }

        // Check daily usage limit for Plus plan users
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get user's subscription
        const { data: subscriptions } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_email', session.user.email)
            .eq('status', 'active')
            .single();

        const isPlusPlan = subscriptions?.plan_name?.toLowerCase().includes('plus');

        if (isPlusPlan) {
            // Count today's usage
            const { count } = await supabase
                .from('usage')
                .select('*', { count: 'exact' })
                .eq('user_id', session.user.id)
                .gte('created_at', today.toISOString())
                .lt('created_at', tomorrow.toISOString());

            if (count && count >= 3) {
                return NextResponse.json(
                    { error: 'Daily usage limit reached. Please wait for reset or upgrade to Pro plan.' },
                    { status: 403 }
                );
            }
        }

        // Solve the problem
        const solution = await solveMathProblem(prompt, imageData);
        
        // Record the usage
        if (session.user.id) {
            await supabase.from('usage').insert({
                user_id: session.user.id,
                subscription_id: subscriptions?.id,
                calculation_type: 'integral',
                input_data: { prompt, has_image: !!imageData }
            });
        }
        
        const response: MathProblemResponse = {
            solution,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Error in solve-math API:', error);
        
        // Handle specific OpenAI API errors
        if (error?.response?.status === 404) {
            return NextResponse.json(
                { error: 'The AI model is currently unavailable. Please try again later.' },
                { status: 503 }
            );
        }
        
        return NextResponse.json(
            { error: error?.message || 'Failed to solve math problem' },
            { status: error?.response?.status || 500 }
        );
    }
} 