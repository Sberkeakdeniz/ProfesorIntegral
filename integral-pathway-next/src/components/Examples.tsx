'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const examples = [
  {
    title: "Basic Integration",
    problem: "∫ x² dx",
    solution: "x³/3 + C"
  },
  {
    title: "Trigonometric",
    problem: "∫ sin(x) dx",
    solution: "-cos(x) + C"
  },
  {
    title: "Exponential",
    problem: "∫ eˣ dx",
    solution: "eˣ + C"
  },
  {
    title: "Double Integral",
    problem: "∫∫ xy dxdy",
    solution: "x²y²/4 + C"
  },
  {
    title: "Integration by Parts",
    problem: "∫ x ln(x) dx",
    solution: "x²ln(x)/2 - x²/4 + C"
  },
  {
    title: "Definite Integral",
    problem: "∫₀π sin(x) dx",
    solution: "[-cos(x)]₀π = 2"
  },
  {
    title: "Derivative",
    problem: "d/dx (x³ + 2x²)",
    solution: "3x² + 4x"
  },
  {
    title: "Product Integration",
    problem: "∫ x sin(x) dx",
    solution: "-x cos(x) + sin(x) + C"
  },
  {
    title: "Substitution Method",
    problem: "∫ cos(2x) dx",
    solution: "sin(2x)/2 + C"
  }
];

export const Examples = () => {
  return (
    <section id="examples" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Example Calculations
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-colors hover:shadow-lg"
            >
              <CardHeader className="text-center pb-2 bg-primary/10 border-b">
                <CardTitle className="text-xl font-bold text-primary tracking-tight">
                  {example.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="text-center bg-muted/30 p-4 rounded-lg">
                  <div className="text-lg font-medium mb-2">Problem:</div>
                  <div className="text-xl text-primary">{example.problem}</div>
                </div>
                <div className="text-center bg-muted/30 p-4 rounded-lg">
                  <div className="text-lg font-medium mb-2">Solution:</div>
                  <div className="text-xl text-primary">{example.solution}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};