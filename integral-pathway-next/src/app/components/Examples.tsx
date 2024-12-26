"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const examples = [
  {
    title: "Basic Integration",
    integral: "∫ x² dx",
    solution: "x³/3 + C"
  },
  {
    title: "Trigonometric",
    integral: "∫ sin(x) dx",
    solution: "-cos(x) + C"
  },
  {
    title: "Exponential",
    integral: "∫ eˣ dx",
    solution: "eˣ + C"
  }
];

export const Examples = () => {
  return (
    <section id="examples" className="py-20 math-grid">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Example Calculations
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">{example.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-mono">{example.integral}</div>
                <div className="text-primary font-mono">{example.solution}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 