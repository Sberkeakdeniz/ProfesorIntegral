import { api } from '@/lib/polar';
import { ProductCard } from '@/components/ProductCard';
import { Header } from "@/components/Header";

export default async function PricingPage() {
  const organizationId = process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_ID || process.env.POLAR_ORGANIZATION_ID;

  // Check if required environment variables are set
  if (!organizationId) {
    console.error('Missing required environment variable: NEXT_PUBLIC_POLAR_ORGANIZATION_ID or POLAR_ORGANIZATION_ID');
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
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
          <main className="min-h-screen pt-24 pb-16">
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
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
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
  } catch (error: any) {
    console.error('Error fetching Polar products:', error?.message || error);
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
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