import { NextResponse } from 'next/server';
import { solveMathProblem } from '@/lib/openai';
import { MathProblemRequest, MathProblemResponse } from '@/types/math';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;
        const image = formData.get('image') as File | null;
        const steps = formData.get('steps') === 'true';

        if (!prompt && !image) {
            return NextResponse.json(
                { error: 'No prompt or image provided' },
                { status: 400 }
            );
        }

        let imageData: string | undefined;
        if (image) {
            try {
                const bytes = await image.arrayBuffer();
                const base64 = Buffer.from(bytes).toString('base64');
                const mimeType = image.type || 'image/png';
                
                // Format as a data URL for the OpenAI Vision API
                imageData = `data:${mimeType};base64,${base64}`;
            } catch (imageError) {
                console.error('Error processing image:', imageError);
                return NextResponse.json(
                    { error: 'Failed to process the uploaded image' },
                    { status: 400 }
                );
            }
        }

        const solution = await solveMathProblem(prompt, imageData);
        
        const response: MathProblemResponse = {
            solution,
            steps: steps ? solution.split('\n').filter(line => line.trim()) : undefined
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