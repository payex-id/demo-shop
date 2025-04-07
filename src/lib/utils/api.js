import { PAYEX_API_KEY, PAYEX_MERCHANT_ID, PAYEX_API_BASE_URL } from '$env/static/private';
import crypto from 'crypto';
import axios from 'axios';
import https from 'https';

/**
 * Выполняет запрос к API PayEx с игнорированием проверки сертификата
 * @param {string} endpoint - Эндпоинт API (без базового URL)
 * @param {Object} options - Опции запроса
 * @returns {Promise<Object>} - Результат запроса
 */
export async function payexRequest(endpoint, options = {}) {
	// Генерируем nonce (уникальный ID запроса)
	const nonce = Math.floor(Date.now() * 10000).toString();
	
	// Генерируем токен для авторизации
	const token = crypto
		.createHmac('sha256', PAYEX_API_KEY)
		.update(nonce)
		.digest('hex');
	
	// Создаем экземпляр axios с игнорированием проверки сертификата
	const instance = axios.create({
		httpsAgent: new https.Agent({
			rejectUnauthorized: false
		})
	});
	
	// Объединяем заголовки
	const headers = {
		'Content-Type': 'application/json',
		'Merchant': PAYEX_MERCHANT_ID,
		'Nonce': nonce,
		'Token': token,
		...options.headers
	};
	
	try {
		// Выполняем запрос
		const response = await instance({
			method: options.method || 'GET',
			url: `${PAYEX_API_BASE_URL}${endpoint}`,
			headers,
			data: options.body ? JSON.parse(options.body) : undefined
		});
		
		// Проверяем успешность ответа
		if (response.data.status !== 'success') {
			throw new Error(response.data.error || `Failed to process request to ${endpoint}`);
		}
		
		return response.data;
	} catch (error) {
		console.error(`Error in payexRequest to ${endpoint}:`, error);
		throw error;
	}
}