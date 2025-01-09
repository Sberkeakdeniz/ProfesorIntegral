'use client';

import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <div className="text-2xl font-bold text-primary transform -rotate-6 relative top-[1px] mr-2">∫</div>
              <span className="text-xl font-semibold tracking-wide font-cormorant text-foreground">
                Profesor Integral
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Your smart companion for calculus homework. Get step-by-step solutions and boost your understanding of integral calculus.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#examples" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/solve" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Profesor Integral. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 