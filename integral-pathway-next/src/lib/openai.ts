import OpenAI from 'openai';

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
                                text: prompt || "Please solve this integral step by step, showing all work clearly and following the LaTeX formatting rules exactly."
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
                        description: "Format the integral solution in a structured way",
                        parameters: solutionFormat
                    }
                ],
                function_call: { name: "formatSolution" },
                temperature: 0.3,
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
                        content: prompt
                    }
                ],
                functions: [
                    {
                        name: "formatSolution",
                        description: "Format the integral solution in a structured way",
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
    let output = `${solution.header}\n\n`;
    output += `To evaluate the ${solution.definiteIntegral}\n\n`;
    
    // Add steps
    solution.steps.forEach((step: any) => {
        output += `${step.stepNumber}. ${step.term}: $${step.integral}$\n\n`;
    });
    
    // Add combined result
    output += `Now, combining all the results:\n\n`;
    output += `$${solution.combinedResult}$\n\n`;
    
    // Add evaluation if present
    if (solution.evaluation) {
        output += `Now we calculate:\n\n`;
        if (solution.evaluation.expression) {
            output += `$${solution.evaluation.expression}$\n\n`;
        }
        
        // Upper limit calculation
        if (solution.evaluation.upperLimit) {
            output += `At $x = ${solution.evaluation.upperLimit.value}$:\n`;
            output += `$${solution.evaluation.upperLimit.calculation}$\n\n`;
            
            if (solution.evaluation.upperLimit.steps) {
                solution.evaluation.upperLimit.steps.forEach((step: string) => {
                    output += `$${step}$\n`;
                });
                output += '\n';
            }
        }
        
        // Lower limit calculation
        if (solution.evaluation.lowerLimit) {
            output += `At $x = ${solution.evaluation.lowerLimit.value}$:\n`;
            output += `$${solution.evaluation.lowerLimit.calculation}$\n\n`;
        }
        
        // Final result
        if (solution.evaluation.finalResult) {
            output += `The definite integral is:\n`;
            output += `$${solution.evaluation.finalResult}$`;
        }
    }
    
    return output;
} 