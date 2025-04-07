import { json } from '@sveltejs/kit';
import { payexRequest } from '$lib/utils/api';

export async function POST({ request }) {
	try {
		const { method_id, amount } = await request.json();
		
		// Получаем origin для формирования URL
		const origin = request.headers.get('origin') || 'http://localhost:5173';
		
		const data = await payexRequest('/api/v1/invoice/create', {
			method: 'POST',
			body: JSON.stringify({
				method_id,
				amount,
				currency: 'USDT',
				order_id: `order-${Date.now()}`,
				callback_url: `${origin}/api/payment-callback`,
				success_url: `${origin}/payment/success`,
				error_url: `${origin}/payment/error`
			})
		});
		
		return json({
			invoice_id: data.invoice.id,
			payment_url: data.invoice.payment_url
		});
	} catch (error) {
		console.error('Error creating invoice:', error);
		return new Response(JSON.stringify({ error: 'Failed to create invoice' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
} 