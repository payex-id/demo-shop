import { json } from '@sveltejs/kit';
import { payexRequest } from '$lib/utils/api';

export async function GET() {
	try {
		const data = await payexRequest('/api/v1/methods', {
			method: 'POST'
		});

		return json(data.list);
	} catch (error) {
		console.error('Error fetching payment methods:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch payment methods' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
} 