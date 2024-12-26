"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-200">∫</span>
          <div className="flex flex-col items-start">
            <span className="text-xl font-semibold tracking-tight">Profesor Integral</span>
            <span className="text-sm text-muted-foreground -mt-1">Integral Solver</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors duration-200">Features</a>
          <a href="#examples" className="text-muted-foreground hover:text-primary transition-colors duration-200">Examples</a>
          <Button variant="default" className="shadow-sm hover:shadow-md transition-shadow">
            Try Calculator
          </Button>
        </nav>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}; 