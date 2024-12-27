export interface MathProblemRequest {
    prompt: string;
    type?: 'calculus' | 'algebra' | 'general';
    steps?: boolean;  // Whether to show step-by-step solution
}

export interface MathProblemResponse {
    solution: string;
    steps?: string[];
    error?: string;
} 