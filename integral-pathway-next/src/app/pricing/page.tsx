import { api } from '@/lib/polar';
import { ProductCard } from '@/components/ProductCard';
import { Header } from "@/components/Header";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PricingPage({
    searchParams
}: PageProps) {
    await searchParams; // Ensure searchParams is resolved
    const organizationId = process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_ID || process.env.POLAR_ORGANIZATION_ID;

    // Check if required environment variables are set
    if (!organizationId) {
        console.error('Missing required environment variable: NEXT_PUBLIC_POLAR_ORGANIZATION_ID or POLAR_ORGANIZATION_ID');
        return (
            <>
                <Header />
                <main className="min-h-screen pt-24 pb-16 flex items-center">
                    <div className="container px-6">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Configuration Error</h1>
                            <p>Please check your environment configuration.</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    try {
        const { result } = await api.products.list({
            organizationId,
            isArchived: false,
        });

        // If no products are found, show a message
        if (!result?.items?.length) {
            return (
                <>
                    <Header />
                    <main className="min-h-screen pt-24 pb-16 flex items-center">
                        <div className="container px-6">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4">No Products Available</h1>
                                <p>Please check your Polar dashboard to ensure you have published products.</p>
                            </div>
                        </div>
                    </main>
                </>
            );
        }

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
                                {result.items.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    } catch (error: any) {
        console.error('Error fetching Polar products:', error?.message || error);
        return (
            <>
                <Header />
                <main className="min-h-screen pt-24 pb-16 flex items-center">
                    <div className="container px-6">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Unable to Load Products</h1>
                            <p>We're experiencing technical difficulties. Please try again later.</p>
                            {process.env.NODE_ENV === 'development' && (
                                <p className="mt-4 text-sm text-red-500">{error?.message || 'Unknown error occurred'}</p>
                            )}
                        </div>
                    </div>
                </main>
            </>
        );
    }
} 