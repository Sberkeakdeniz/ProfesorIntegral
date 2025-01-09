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
- Format integrals using \\int with proper spacing (e.g., $\\int x^2\\,dx$)
- Format fractions using \\frac{numerator}{denominator}
- Use proper LaTeX commands for all mathematical symbols:
  * Integration by parts: $\\int u\\,dv = uv - \\int v\\,du$
  * Exponentials: $e^x$ (not ex)
  * Products: $2x$ or $2 \\cdot x$ (with proper spacing)
  * Powers: $x^2$ (not x2)
  * Differentials: $\\,dx$ (with proper spacing)
- Show each step clearly with numbers
- Keep expressions clean and aligned
- Break calculations into clear steps
- Show all work in a logical sequence

Example of proper LaTeX formatting:

$x^2e^x$: Using integration by parts, let:
$u = x^2$ and $dv = e^x\\,dx$

Then:
$du = 2x\\,dx$ and $v = e^x$

Using the formula $\\int u\\,dv = uv - \\int v\\,du$:

$\\int x^2e^x\\,dx = x^2e^x - \\int e^x(2x)\\,dx$

Again using integration by parts for $\\int 2xe^x\\,dx$:
Let $u = 2x$ and $dv = e^x\\,dx$

Then:
$du = 2\\,dx$ and $v = e^x$

Therefore:
$\\int 2xe^x\\,dx = 2xe^x - \\int 2e^x\\,dx = 2xe^x - 2e^x$

Final result:
$\\int x^2e^x\\,dx = x^2e^x - (2xe^x - 2e^x) = x^2e^x - 2xe^x + 2e^x + C$`;

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
    
    // Add the definite integral if present
    if (solution.definiteIntegral) {
        output += `${solution.definiteIntegral}\n\n`;
    }
    
    // Add steps with proper LaTeX formatting
    solution.steps.forEach((step: any) => {
        output += `${step.stepNumber}. ${step.term}\n`;
        if (step.integral) {
            output += `$${step.integral}$\n\n`;
        }
    });
    
    // Add combined result with proper LaTeX formatting
    if (solution.combinedResult) {
        output += `Therefore:\n$${solution.combinedResult}$\n\n`;
    }
    
    // Add evaluation if present
    if (solution.evaluation) {
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
            output += `Final result:\n$${solution.evaluation.finalResult}$`;
        }
    }
    
    return output;
} 