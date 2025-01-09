'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ProductCardProps {
    product: any; // Keep the Polar.sh product type
}

export const ProductCard = ({ product }: ProductCardProps) => {
    // Keep the existing Polar.sh price handling
    const firstPrice = product.prices[0]
    const price = useMemo(() => {
        switch(firstPrice.amountType) {
            case 'fixed':
                return `$${firstPrice.priceAmount / 100}`
            case 'free':
                return 'Free'
            default:
                return 'Pay what you want'
        }
    }, [firstPrice])

    // Add yearly pricing
    const yearlyPrice = useMemo(() => {
        const isPro = product.name.toLowerCase().includes('pro');
        return isPro ? '$59.99' : '$39.99';
    }, [product.name]);

    // Calculate monthly equivalent for yearly plan
    const monthlyEquivalent = useMemo(() => {
        const isPro = product.name.toLowerCase().includes('pro');
        return isPro ? '$5.00' : '$3.33';
    }, [product.name]);

    // Enhance the product content based on the plan
    const enhancedContent = useMemo(() => {
        const isPro = product.name.toLowerCase().includes('pro');
        return {
            title: isPro ? 'Professional Plan' : 'Essential Plan',
            description: isPro 
                ? 'Unlock the full power of advanced calculus solutions with our comprehensive Professional plan. Perfect for students and educators who demand excellence.'
                : 'Experience reliable calculus assistance with our Essential plan. Ideal for students seeking clear, step-by-step mathematical guidance.',
            benefits: isPro ? [
                { id: 1, description: 'Unlimited Advanced Calculations' },
                { id: 2, description: 'Detailed Step-by-Step Solutions' },
                { id: 3, description: 'Image Upload & Recognition' },
                { id: 4, description: 'Priority Support Access' },
                { id: 5, description: 'Advanced Problem Explanations' }
            ] : [
                { id: 1, description: 'Step-by-Step Solutions' },
                { id: 2, description: '3 Solutions per day'},
                { id: 3, description: 'Text-Based Problem Solving' },
                { id: 4, description: 'Basic Problem Explanations' },
                { id: 5, description: 'Standard Support' }
            ]
        };
    }, [product.name]);

    // Keep the existing Polar.sh checkout handling
    const handleCheckout = async () => {
        try {
            const response = await fetch(`/api/checkout?priceId=${firstPrice.id}`);
            if (!response.ok) {
                throw new Error('Checkout failed');
            }
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to initiate checkout. Please try again.');
        }
    };

    return (
        <Card className="backdrop-blur-sm bg-card/50 border transition-all duration-300 hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            
            <CardHeader className="relative pb-4 space-y-2">
                <CardTitle className="text-xl font-bold text-primary">
                    {enhancedContent.title}
                </CardTitle>
                <CardDescription className="text-sm">
                    {enhancedContent.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-4">
                {/* Monthly Price */}
                <div>
                    <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-primary">
                            {price}
                        </span>
                        <span className="text-muted-foreground ml-2 text-sm">/month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Billed monthly</p>
                </div>

                {/* Yearly Price */}
                <div className="space-y-1 p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-primary">
                            {yearlyPrice}
                        </span>
                        <span className="text-muted-foreground ml-2 text-sm">/year</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Save up to 50% with yearly billing
                    </p>
                    <p className="text-xs text-primary font-medium">
                        Only {monthlyEquivalent}/month when billed annually
                    </p>
                </div>

                <ul className="space-y-2 pt-2">
                    {enhancedContent.benefits.map((benefit) => (
                        <li key={benefit.id} className="flex items-center gap-2">
                            <div className="rounded-full p-1 bg-primary/10">
                                <Check className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-muted-foreground text-xs">
                                {benefit.description}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="relative pt-2 pb-4">
                <Button 
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-sm py-4"
                >
                    Get Started Now
                </Button>
            </CardFooter>
        </Card>
    );
}