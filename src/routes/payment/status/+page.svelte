<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	let invoiceStatus = null;
	let webhookData = null;
	let webhookError = null;
	let loading = true;
	let error = null;
	let updateInterval;
	let emulating = false;
	
	async function updatePaymentInfo() {
		const invoice_id = $page.url.searchParams.get('invoice_id');
		if (!invoice_id) {
			error = 'No invoice ID provided';
			loading = false;
			return;
		}
		
		try {
			// Получаем статус инвойса
			const statusResponse = await fetch(`/api/invoice-status/${invoice_id}`);
			if (!statusResponse.ok) throw new Error('Failed to fetch invoice status');
			invoiceStatus = await statusResponse.json();
			
			// Получаем данные вебхука
			const webhookResponse = await fetch(`/api/webhook-data/${invoice_id}`);
			if (webhookResponse.ok) {
				webhookData = await webhookResponse.json();
			} else if (webhookResponse.status === 404) {
				webhookError = 'Waiting for payment confirmation from Payex...';
			} else {
				webhookError = 'Failed to fetch webhook data';
			}

            // Если счет оплачен, прекращаем обновление
			if (invoiceStatus.is_paid) {
				if (updateInterval) {
					clearInterval(updateInterval);
					updateInterval = null;
				}
				return;
			}
			
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
	
	async function emulatePayment() {
		if (!invoiceStatus?.id) return;
		
		emulating = true;
		try {
			const response = await fetch('/api/emulate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ invoice_id: invoiceStatus.id })
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to emulate payment');
			}

			// Обновляем информацию о платеже
			await updatePaymentInfo();
		} catch (e) {
			error = e.message;
		} finally {
			emulating = false;
		}
	}
	
	onMount(async () => {
		await updatePaymentInfo();
		// Обновляем информацию каждые 5 секунд, только если счет не оплачен
		if (!invoiceStatus?.is_paid) {
			updateInterval = setInterval(updatePaymentInfo, 5000);
		}
		
		return () => {
			// Очищаем интервал при размонтировании компонента
			if (updateInterval) clearInterval(updateInterval);
		};
	});
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center">
	<main class="container mx-auto px-4 py-8">
		<div class="max-w-2xl mx-auto text-center">
			{#if loading}
				<div class="py-8">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
					<p class="mt-4 text-gray-600">Checking payment status...</p>
				</div>
			{:else if error}
				<div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-red-700">{error}</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="bg-white rounded-xl shadow-lg overflow-hidden p-8">
					
					
					{#if invoiceStatus}
                        {#if invoiceStatus.is_paid}
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                            <p class="text-gray-600 mb-8">Thank you for your purchase. Your payment has been processed successfully.</p>
                        {:else}
                            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg class="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-4">Invoice created</h1>
                            

                                    
                            {#if invoiceStatus && invoiceStatus.payment_url}
                                <div class="mb-8 flex gap-4 justify-center">
                                    <a href={invoiceStatus.payment_url} target="_blank" rel="noopener noreferrer" class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                        Go to payment
                                    </a>
                                    <button 
                                        class="inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        on:click={emulatePayment}
                                        disabled={emulating}
                                    >
                                        {emulating ? 'Эмулируем...' : 'Эмулировать платеж'}
                                    </button>
                                </div>
                            {/if}
                            
                        {/if}


						<div class="bg-gray-50 rounded-lg p-6 mb-8">
							<div class="grid grid-cols-2 gap-4 text-left">
								<div>
									<p class="text-sm text-gray-500">Invoice ID</p>
									<p class="font-medium">{invoiceStatus.id}</p>
								</div>
								<div>
									<p class="text-sm text-gray-500">Status</p>
									<p class="font-medium {invoiceStatus.is_paid ? 'text-green-600' : 'text-yellow-500'}">{invoiceStatus.status}</p>
								</div>
								<div>
									<p class="text-sm text-gray-500">Amount</p>
									<p class="font-medium">
										{(invoiceStatus.amount).toFixed(2)}
										{invoiceStatus.currency}
									</p>
								</div>
								<div>
									<p class="text-sm text-gray-500">Method</p>
									<p class="font-medium">{invoiceStatus.method_name}</p>
								</div>
							</div>
						</div>
					{/if}

                    {#if webhookData}
                        <div class="bg-gray-50 rounded-lg p-6 mb-8">
                            <h2 class="text-xl font-semibold mb-4">Webhook Data</h2>
                            <div class="text-left overflow-auto max-h-60">
                                <pre class="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(webhookData, null, 2)}</pre>
                            </div>
                        </div>
                    {:else if webhookError}
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-yellow-700">{webhookError}</p>
                                </div>
                            </div>
                        </div>
                    {/if}
                  
					<a href="/" class="inline-block bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors">
						Return to Home
					</a>
				</div>
			{/if}
		</div>
	</main>
</div> 