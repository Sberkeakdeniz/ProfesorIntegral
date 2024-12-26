"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="hero-gradient min-h-screen pt-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Profesor Integral:
            <span className="text-primary"> Your Calculus Companion</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Your smart companion for calculus homework. Get step-by-step solutions
            and boost your understanding of integral calculus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg">
              Start Calculating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              View Examples
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 