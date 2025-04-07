import { json } from '@sveltejs/kit';
import { PAYEX_API_KEY, PAYEX_MERCHANT_ID } from '$env/static/private';
import crypto from 'crypto';
import { saveWebhookData } from '$lib/webhookStore';

export async function POST({ request }) {
	try {
		// Получаем данные из вебхука
		const webhookData = await request.json();
		
		// Получаем заголовки для проверки подлинности
		const merchant = webhookData.merchant;
		
		// Проверяем подлинность вебхука
		if (merchant !== PAYEX_MERCHANT_ID) {
			return new Response(JSON.stringify({ error: 'Invalid merchant' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		// Сортируем ключи объекта перед преобразованием в JSON
		const sortedData = {};
		Object.keys(webhookData).sort().forEach(key => {
			if (key !== 'sign') {
				sortedData[key] = webhookData[key];
			}
		});
		let data = JSON.stringify(sortedData);
		
		// Проверяем токен
		const expectedSign = crypto
			.createHmac('sha256', PAYEX_API_KEY)
			.update(data)
			.digest('hex');
			
		if (webhookData.sign !== expectedSign) {
			return new Response(JSON.stringify({ 
				error: 'Invalid token' ,
				expectedSign: expectedSign,
				data: data,
				sign: webhookData.sign
			}), {
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		
		// Обрабатываем данные вебхука
		console.log('Webhook received:', webhookData);
		
		// Сохраняем данные вебхука
		if (webhookData.invoice_id) {
			saveWebhookData(webhookData.invoice_id, webhookData);
		}
		
		// Здесь можно добавить логику обработки статуса платежа
		// Например, обновить статус заказа в базе данных
		
		// Возвращаем успешный ответ
		return json({ success: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return new Response(JSON.stringify({ error: 'Failed to process webhook' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
} 