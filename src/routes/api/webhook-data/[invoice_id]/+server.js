import { json } from '@sveltejs/kit';
import { getWebhookData } from '$lib/webhookStore';

export async function GET({ params }) {
	try {
		const { invoice_id } = params;
		
		if (!invoice_id) {
			return new Response(JSON.stringify({ error: 'Invoice ID is required' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		
		const webhookData = getWebhookData(invoice_id);
		
		if (!webhookData) {
			return new Response(JSON.stringify({ error: 'Webhook data not found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		
		return json(webhookData);
	} catch (error) {
		console.error('Error fetching webhook data:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch webhook data' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
} 