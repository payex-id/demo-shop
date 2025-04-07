<script>
	import { page } from '$app/stores';
	
	const error = $page.url.searchParams.get('error') || 'An unknown error occurred';
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center">
	<main class="container mx-auto px-4 py-8">
		<div class="max-w-2xl mx-auto text-center">
			<div class="bg-white rounded-xl shadow-lg overflow-hidden p-8">
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</div>
				
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
				<p class="text-gray-600 mb-8">We're sorry, but there was an error processing your payment.</p>
				
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
				
				<div class="space-y-4">
					<a href="/" class="inline-block bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors">
						Return to Home
					</a>
					<div>
						<a href="/contact" class="text-primary-600 hover:text-primary-700 font-medium">
							Contact Support
						</a>
					</div>
				</div>
			</div>
		</div>
	</main>
</div> 