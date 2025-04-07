import { json } from '@sveltejs/kit';
import { payexRequest } from '$lib/utils/api';

export async function POST({ request }) {
	try {
		const { invoice_id } = await request.json();
		
		if (!invoice_id) {
			return json({ error: 'Invoice ID is required' }, { status: 400 });
		}

		const data = await payexRequest('/api/v1/invoice/emulate', {
			method: 'POST',
			body: JSON.stringify({ invoice_id })
		});
		
		return json(data);
	} catch (error) {
		console.error('Error emulating payment:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
} 