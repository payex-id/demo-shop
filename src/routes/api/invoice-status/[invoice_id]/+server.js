import { json } from '@sveltejs/kit';
import { payexRequest } from '$lib/utils/api';

export async function GET({ params }) {
	try {
		const { invoice_id } = params;
		
		const data = await payexRequest('/api/v1/invoice/info', {
			method: 'POST',
			body: JSON.stringify({ invoice_id })
		});
		
		return json(data.invoice);
	} catch (error) {
		console.error('Error fetching invoice status:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch invoice status' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
} 