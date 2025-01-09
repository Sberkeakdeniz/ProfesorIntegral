'use client';

import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubscriptionData {
  id: string;
  status: string;
  product: {
    name: string;
  };
  current_period_end: string;
  customer: {
    id: string;
    email: string;
  };
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState("");

  // Fetch subscription data
  useEffect(() => {
    fetchSubscription();
  }, [session?.user?.email]);

  const fetchSubscription = async () => {
    if (!session?.user?.email) return;

    try {
      console.log('Fetching subscription data...');
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      
      console.log('Raw subscription response:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.items && data.items.length > 0) {
        const subscriptionData = data.items[0];
        console.log('Setting subscription data:', JSON.stringify(subscriptionData, null, 2));
        setSubscription(subscriptionData);
        setSubscriptionId(subscriptionData.id);
      } else {
        console.log('No subscription found');
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to fetch subscription data');
    }
  };


  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      // Refresh subscription data
      await fetchSubscription();
      alert('Subscription cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (!session) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Please Sign In</h1>
              <p>You need to be signed in to manage your subscription.</p>
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
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary/75 bg-clip-text text-transparent">
              Account Settings
            </h1>
            
            <div className="space-y-8">
              {/* Profile Section */}
              <section className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                </div>
              </section>

              {/* Subscription Management Section */}
              <section className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Subscription</h2>
                {error ? (
                  <div className="text-red-500 mb-4">
                    {error}
                  </div>
                ) : subscription ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold">{subscription.product.name}</p>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          subscription.status === 'active' ? 'bg-green-500/10 text-green-500' :
                          subscription.status === 'canceled' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </span>
                      </div>
                      {subscription.current_period_end && (
                        <p className="text-muted-foreground">
                          {subscription.status === 'canceled' 
                            ? 'Access until: ' 
                            : 'Next billing date: '
                          }
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold mb-2">Plan Features:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Unlimited Integral Calculations
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Step-by-Step Solutions
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Priority Support
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {subscription.status === 'active' && (
                        <Button
                          onClick={handleCancelSubscription}
                          disabled={loading}
                          variant="destructive"
                          className="w-full md:w-auto"
                        >
                          {loading ? 'Loading...' : 'Cancel Subscription'}
                        </Button>
                      )}
                      {subscription.status === 'canceled' && (
                        <div className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-yellow-500">
                            Your subscription has been cancelled. You still have access to all features until {new Date(subscription.current_period_end).toLocaleDateString()}.
                          </p>
                          <Link href="/pricing" className="inline-block mt-2">
                            <Button variant="outline">
                              Renew Subscription
                            </Button>
                          </Link>
                        </div>
                      )}
                      {subscription.status === 'revoked' && (
                        <div className="w-full p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-destructive">
                            Your subscription has ended. Subscribe again to regain access to all features.
                          </p>
                          <Link href="/pricing" className="inline-block mt-2">
                            <Button>
                              View Plans
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>You don't have an active subscription.</p>
                    <Link href="/pricing">
                      <Button className="w-full md:w-auto">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 