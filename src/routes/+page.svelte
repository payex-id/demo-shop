<script>
	import { onMount } from 'svelte';
	
	let paymentMethods = [];
	let selectedMethod = null;
	let loading = false;
	let error = null;
	
	async function loadPaymentMethods() {
		try {
			loading = true;
			const response = await fetch('/api/payment-methods');
			if (!response.ok) throw new Error('Failed to load payment methods');
			paymentMethods = await response.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
	
	async function handlePayment() {
		if (!selectedMethod) return;
		
		try {
			loading = true;
			const response = await fetch('/api/create-invoice', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					method_id: selectedMethod,
					amount: 10,
					currency: 'USDT'
				})
			});
			
			if (!response.ok) throw new Error('Failed to create invoice');
			
			const { invoice_id } = await response.json();
			window.location.href = `/payment/status?invoice_id=${invoice_id}`;
		} catch (e) {
			error = e.message;
			loading = false;
		}
	}
	
	onMount(loadPaymentMethods);
</script>

<div class="min-h-screen bg-gray-50">
	<main class="container mx-auto px-4 py-8">
		<div class="max-w-2xl mx-auto">
			<h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Demo Shop</h1>
			
			<!-- Demo Product Card -->
			<div class="bg-white rounded-xl shadow-lg overflow-hidden">
				<div class="p-8">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-2xl font-semibold text-gray-900">Demo Product</h2>
						<span class="text-3xl font-bold text-primary-600">$10.00</span>
					</div>
					
					<p class="text-gray-600 mb-8">
						This is a demo product for testing PayEx integration. Choose a payment method below to proceed with the purchase.
					</p>
					
					{#if loading}
						<div class="flex justify-center py-8">
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
						<div class="space-y-6">
							{#if paymentMethods.length > 0}
								<div class="space-y-4">
									{#each paymentMethods as method}
										<label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors {selectedMethod === method.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}">
											<input
												type="radio"
												name="payment-method"
												value={method.id}
												bind:group={selectedMethod}
												class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
											/>
											<span class="ml-3 text-gray-900">{method.name}</span>
										</label>
									{/each}
								</div>
								
								<button
									on:click={handlePayment}
									disabled={!selectedMethod || loading}
									class="w-full py-3 px-4 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? 'Processing...' : 'Pay $10.00'}
								</button>
							{:else}
								<p class="text-center text-gray-500 py-4">No payment methods available</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</main>
</div> 