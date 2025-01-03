'use client';

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const tiers = [
  {
    name: "Free",
    monthlyPrice: "0",
    annualPrice: "0",
    description: "Perfect for trying out Professor Integral",
    features: [
      "1 solve per day",
      "Basic step-by-step solutions",
      "Text input only",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Plus",
    monthlyPrice: "4.99",
    annualPrice: "49.99",
    description: "Great for students and homework help",
    features: [
      "3 solves per day",
      "Detailed step-by-step solutions",
      "Image upload support",
      "Priority support",
      "Solution history",
      "Multiple solution methods",
    ],
    buttonText: "Choose Plus",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Pro",
    monthlyPrice: "9.99",
    annualPrice: "99.99",
    description: "For power users and educators",
    features: [
      "Unlimited solves",
      "Advanced step-by-step solutions",
      "Image upload support",
      "24/7 Priority support",
      "Solution history & export",
      "Multiple solution methods",
      "Batch problem solving",
      "API access",
    ],
    buttonText: "Choose Pro",
    buttonVariant: "default" as const,
    popular: false,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const annualSavings = {
    Plus: ((4.99 * 12) - 49.99).toFixed(2),
    Pro: ((9.99 * 12) - 99.99).toFixed(2)
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="container px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/90 to-primary/75 bg-clip-text text-transparent pb-2">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the perfect plan for your mathematical journey
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-6 bg-accent/50 p-1.5 px-3 rounded-full">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                  !isAnnual 
                    ? 'text-primary-foreground bg-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                  isAnnual 
                    ? 'text-primary-foreground bg-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual
                {isAnnual && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full font-medium">
                    -17%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tiers.map((tier) => (
              <Card 
                key={tier.name}
                className={`relative flex flex-col border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl ${
                  tier.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-6">
                  <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  {isAnnual && tier.name !== 'Free' && (
                    <div className="mt-2 text-sm text-green-500">
                      Save ${annualSavings[tier.name as keyof typeof annualSavings]} per year
                    </div>
                  )}
                  <CardDescription className="mt-3 text-base">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button 
                    variant={tier.buttonVariant} 
                    size="lg"
                    className={`w-full font-medium text-base ${
                      tier.buttonVariant === 'default' 
                        ? 'shadow-lg hover:shadow-xl bg-primary/90 hover:bg-primary' 
                        : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-24 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Have questions about our pricing? Contact our support team at{" "}
              <a href="mailto:support@profesorintegral.com" className="text-primary hover:underline">
                support@profesorintegral.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
} 