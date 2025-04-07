import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const { name, email, subject, message } = await request.json();
		
		// Здесь можно добавить отправку email или сохранение в базу данных
		// Для демонстрации просто логируем данные
		console.log('Contact form submission:', { name, email, subject, message });
		
		// Имитация задержки для демонстрации состояния загрузки
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		return json({ success: true });
	} catch (error) {
		console.error('Error processing contact form:', error);
		return json({ error: 'Failed to process your message' }, { status: 500 });
	}
} 