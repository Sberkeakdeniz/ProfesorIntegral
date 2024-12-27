import { NextResponse } from 'next/server';
import { solveMathProblem } from '@/lib/openai';
import { MathProblemRequest, MathProblemResponse } from '@/types/math';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, imageData } = body;

        if (!prompt && !imageData) {
            return NextResponse.json(
                { error: 'No prompt or image provided' },
                { status: 400 }
            );
        }

        const solution = await solveMathProblem(prompt, imageData);
        
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