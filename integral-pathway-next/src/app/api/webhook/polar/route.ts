// src/app/api/webhook/polar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Polar } from "@polar-sh/sdk";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
	try {
		const supabase = createRouteHandlerClient({ cookies });
		const body = await req.json();
		const signature = req.headers.get('x-polar-signature');
		const type = body.type;

		console.log('Received webhook event type:', type);
		console.log('Webhook payload:', JSON.stringify(body, null, 2));

		// Handle different subscription events
		switch (type) {
			case 'subscription.active': {
				// Subscription is active - update database
				console.log('Subscription activated:', body.data.subscription_id);
				const { error } = await supabase
					.from('subscriptions')
					.upsert({
						subscription_id: body.data.subscription_id,
						customer_id: body.data.customer_id,
						status: 'active',
						current_period_end: body.data.current_period_end,
						updated_at: new Date().toISOString()
					});

				if (error) {
					console.error('Error updating subscription status:', error);
					throw error;
				}
				break;
			}

			case 'subscription.canceled': {
				// Don't revoke access immediately
				console.log('Subscription cancelled:', body.data.subscription_id);
				const { error } = await supabase
					.from('subscriptions')
					.update({
						status: 'canceled',
						updated_at: new Date().toISOString()
						// Keep the current_period_end as is - they still have access until then
					})
					.eq('subscription_id', body.data.subscription_id);

				if (error) {
					console.error('Error updating subscription status:', error);
					throw error;
				}
				break;
			}

			case 'subscription.revoked': {
				// Now we actually revoke access
				console.log('Subscription revoked:', body.data.subscription_id);
				const { error } = await supabase
					.from('subscriptions')
					.update({
						status: 'revoked',
						updated_at: new Date().toISOString(),
						// Clear any access tokens or session data if needed
						access_token: null
					})
					.eq('subscription_id', body.data.subscription_id);

				if (error) {
					console.error('Error revoking subscription:', error);
					throw error;
				}
				break;
			}

			default:
				console.log('Unhandled webhook event type:', type);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json(
			{ error: 'Webhook processing failed' },
			{ status: 500 }
		);
	}
}