import OpenAI from 'openai';
import { MathProblemResponse } from '@/types/math';

// Initialize OpenAI client
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const solutionFormat = {
    type: "object",
    properties: {
        solution: {
            type: "object",
            properties: {
                header: { type: "string" },
                definiteIntegral: { type: "string" },
                steps: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            stepNumber: { type: "number" },
                            term: { type: "string" },
                            integral: { type: "string" }
                        },
                        required: ["stepNumber", "term", "integral"]
                    }
                },
                combinedResult: { type: "string" },
                evaluation: {
                    type: "object",
                    properties: {
                        expression: { type: "string" },
                        upperLimit: {
                            type: "object",
                            properties: {
                                value: { type: "number" },
                                calculation: { type: "string" },
                                steps: { type: "array", items: { type: "string" } }
                            }
                        },
                        lowerLimit: {
                            type: "object",
                            properties: {
                                value: { type: "number" },
                                calculation: { type: "string" }
                            }
                        },
                        finalResult: { type: "string" }
                    }
                }
            },
            required: ["header", "definiteIntegral", "steps", "combinedResult", "evaluation"]
        }
    }
} as const;

export async function solveMathProblem(prompt: string, imageData?: string): Promise<string> {
    const systemPrompt = `You are Professor Integral, an expert in calculus and mathematical problem-solving. Format your responses following these exact rules:

Key formatting rules:
- Use proper LaTeX math mode for ALL mathematical expressions (enclose in $ signs)
- Format integrals using \\int with proper limits (e.g., $\\int_0^2$)
- Format fractions using \\frac{numerator}{denominator}
- Show each step clearly with numbers
- Keep expressions clean and aligned
- Use proper spacing with \\, before dx
- Break calculations into clear steps
- Show all work in a logical sequence
- For image inputs, ensure all mathematical expressions are properly rendered in LaTeX

Example of proper LaTeX formatting:

Solution

To evaluate the definite integral

$\\int_0^2 (2x^2 - 3x + 4)\\,dx$,

we will integrate each term separately and then evaluate the result at the bounds.

First, we find the indefinite integral:

1. For $(2x^2)$: The integral is $\\frac{2}{3}x^3$
2. For $(-3x)$: The integral is $-\\frac{3}{2}x^2$
3. For $(4)$: The integral is $4x$

Thus, the indefinite integral is:
$\\frac{2}{3}x^3 - \\frac{3}{2}x^2 + 4x + C$

Now, we will evaluate this expression from 0 to 2:
$F(x) = \\frac{2}{3}x^3 - \\frac{3}{2}x^2 + 4x$

At $x = 2$:
$F(2) = \\frac{2}{3}(2)^3 - \\frac{3}{2}(2)^2 + 4(2)$

Calculating each term:
$\\frac{2}{3}(2)^3 = \\frac{2}{3} \\cdot 8 = \\frac{16}{3}$
$-\\frac{3}{2}(2)^2 = -\\frac{3}{2} \\cdot 4 = -6$
$4(2) = 8$

Therefore:
$F(2) = \\frac{16}{3} - 6 + 8 = \\frac{16}{3} - \\frac{18}{3} + \\frac{24}{3} = \\frac{22}{3}$`;

    const userPrompt = "Please solve this integral step by step, showing all work clearly and following the LaTeX formatting rules exactly.";

    try {
        if (imageData) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini-2024-07-18",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt || userPrompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageData
                                }
                            }
                        ]
                    }
                ],
                functions: [
                    {
                        name: "formatSolution",
                        description: "Format the integral solution in a structured way with proper LaTeX rendering for all mathematical expressions",
                        parameters: solutionFormat
                    }
                ],
                function_call: { name: "formatSolution" },
                max_tokens: 4096,
            });

            const functionCall = response.choices[0]?.message?.function_call;
            if (functionCall && functionCall.name === "formatSolution") {
                const result = JSON.parse(functionCall.arguments);
                return formatSolutionOutput(result.solution);
            }
            return 'No solution generated';
        } else {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini-2024-07-18",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: prompt || userPrompt
                    }
                ],
                functions: [
                    {
                        name: "formatSolution",
                        description: "Format the integral solution in a structured way with proper LaTeX rendering for all mathematical expressions",
                        parameters: solutionFormat
                    }
                ],
                function_call: { name: "formatSolution" },
                temperature: 0.3,
            });

            const functionCall = completion.choices[0]?.message?.function_call;
            if (functionCall && functionCall.name === "formatSolution") {
                const result = JSON.parse(functionCall.arguments);
                return formatSolutionOutput(result.solution);
            }
            return 'No solution generated';
        }
    } catch (error) {
        console.error('Error solving math problem:', error);
        throw error;
    }
}

function formatSolutionOutput(solution: any): string {
    let output = `Solution\n\n`;
    output += `To evaluate the definite integral\n\n`;
    output += `$${solution.definiteIntegral}$\n\n`;
    output += `we will integrate each term separately and then evaluate the result at the bounds.\n\n`;

    for (const step of solution.steps) {
        output += `${step.stepNumber}. For $${step.term}$: The integral is\n`;
        output += `$${step.integral}$\n\n`;
    }

    output += `Now, combining these results, we have:\n`;
    output += `$${solution.combinedResult}$\n\n`;

    output += `Next, we will evaluate this expression from 0 to 2:\n`;
    output += `$${solution.evaluation.expression}$\n\n`;

    output += `Now we calculate:\n\n`;
    output += `1. At the upper limit $x = 2$:\n`;
    output += `$${solution.evaluation.upperLimit.calculation}$\n\n`;
    
    if (solution.evaluation.upperLimit.steps) {
        output += `Calculating each term:\n`;
        for (const step of solution.evaluation.upperLimit.steps) {
            output += `$${step}$\n`;
        }
        output += '\n';
    }

    output += `2. At the lower limit $x = 0$:\n`;
    output += `$${solution.evaluation.lowerLimit.calculation}$\n\n`;

    output += `The definite integral is:\n`;
    output += `$${solution.evaluation.finalResult}$`;

    return output;
} 