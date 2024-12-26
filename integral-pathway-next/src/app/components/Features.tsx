"use client";

import { Calculator, BookOpen, Clock, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Calculator,
    title: "Smart Calculator",
    description: "Handles definite and indefinite integrals with advanced recognition"
  },
  {
    icon: BookOpen,
    title: "Step-by-Step Solutions",
    description: "Detailed explanations to help you understand the process"
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get answers in milliseconds, perfect for quick homework checks"
  },
  {
    icon: CheckCircle,
    title: "Accuracy Guaranteed",
    description: "Double-checked results with mathematical precision"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Profesor Integral?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 