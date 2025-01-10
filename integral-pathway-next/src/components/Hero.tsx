'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 z-0" />
      <div className="math-grid absolute inset-0 z-0" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-24 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent animate-gradient">
            Profesor Integral
            <span className="block mt-2 text-foreground">
              Your Calculus Companion
            </span>
          </h1>
          
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            Your smart companion for calculus homework. Get step-by-step solutions and boost your
            understanding of integral calculus.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-6">
            <a
              href="/solve"
              className="rounded-full bg-primary px-8 py-3.5 text-lg font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 hover:scale-105"
            >
              Start Calculating →
            </a>
            <a
              href="/examples"
              className="rounded-full px-8 py-3.5 text-lg font-semibold text-primary ring-1 ring-primary hover:bg-primary/5 transition-all duration-200"
            >
              View Examples
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Step-by-Step Solutions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Image Recognition</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Detailed Explanations</span>
          </div>
        </div>
      </div>
    </div>
  );
}