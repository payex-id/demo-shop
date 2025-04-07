// Простое хранилище для данных вебхука
// В реальном приложении здесь должна быть база данных

// Хранилище для данных вебхука
const webhookStore = new Map();

/**
 * Сохраняет данные вебхука для конкретного invoice_id
 * @param {string} invoiceId - ID инвойса
 * @param {Object} webhookData - Данные вебхука
 */
export function saveWebhookData(invoiceId, webhookData) {
	webhookStore.set(invoiceId, {
		...webhookData,
		timestamp: new Date().toISOString()
	});
}

/**
 * Получает данные вебхука для конкретного invoice_id
 * @param {string} invoiceId - ID инвойса
 * @returns {Object|null} - Данные вебхука или null, если не найдены
 */
export function getWebhookData(invoiceId) {
	return webhookStore.get(invoiceId) || null;
} 