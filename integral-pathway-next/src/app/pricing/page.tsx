import { ProductCard } from '@/components/ProductCard';
import { Header } from "@/components/Header";

// Static pricing data as fallback
const fallbackPlans = [
    {
        id: 'essential',
        name: 'Essential Plan',
        prices: [{
            id: 'price_essential_monthly',
            amountType: 'fixed',
            priceAmount: 499,
            interval: 'month'
        }],
        features: [
            'Step-by-Step Solutions',
            '3 Solutions per day',
            'Text-Based Problem Solving',
            'Basic Problem Explanations',
            'Standard Support'
        ]
    },
    {
        id: 'professional',
        name: 'Professional Plan',
        prices: [{
            id: 'price_pro_monthly',
            amountType: 'fixed',
            priceAmount: 999,
            interval: 'month'
        }],
        features: [
            'Unlimited Advanced Calculations',
            'Detailed Step-by-Step Solutions',
            'Image Upload & Recognition',
            'Priority Support Access',
            'Advanced Problem Explanations'
        ]
    }
];

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PricingPage({
    searchParams
}: PageProps) {
    await searchParams;

    return (
        <>
            <Header />
            <main className="min-h-screen flex flex-col justify-center items-center pt-24 pb-16">
                <div className="container px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
                        <p className="text-lg text-muted-foreground">
                            Select the perfect plan for your needs
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                            {fallbackPlans.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
} 