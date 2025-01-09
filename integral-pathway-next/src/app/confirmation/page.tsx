import { Header } from "@/components/Header";

export default function ConfirmationPage({
  searchParams: { checkout_id },
}: {
  searchParams: { checkout_id?: string };
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="container px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary/75 bg-clip-text text-transparent">
              Thank You for Your Purchase!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your checkout is being processed. You will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-muted-foreground">
              Checkout ID: {checkout_id}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}