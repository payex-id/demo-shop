<script>
	let formData = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};
	
	let submitting = false;
	let success = false;
	let error = null;
	
	async function handleSubmit() {
		submitting = true;
		error = null;
		
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});
			
			if (!response.ok) throw new Error('Failed to send message');
			
			success = true;
			formData = {
				name: '',
				email: '',
				subject: '',
				message: ''
			};
		} catch (e) {
			error = e.message;
		} finally {
			submitting = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<main class="container mx-auto px-4">
		<div class="max-w-2xl mx-auto">
			<div class="text-center mb-12">
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Contact Support</h1>
				<p class="text-gray-600">Have a question or need help? We're here to assist you.</p>
			</div>
			
			{#if success}
				<div class="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-green-700">Your message has been sent successfully. We'll get back to you soon.</p>
						</div>
					</div>
				</div>
			{:else}
				<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-xl shadow-lg overflow-hidden p-8">
					<div class="space-y-6">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
						
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input
								type="email"
								id="email"
								bind:value={formData.email}
								required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
						
						<div>
							<label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
							<input
								type="text"
								id="subject"
								bind:value={formData.subject}
								required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
						
						<div>
							<label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="4"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							></textarea>
						</div>
						
						{#if error}
							<div class="bg-red-50 border-l-4 border-red-400 p-4">
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
						{/if}
						
						<button
							type="submit"
							disabled={submitting}
							class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if submitting}
								<span class="flex items-center justify-center">
									<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Sending...
								</span>
							{:else}
								Send Message
							{/if}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</main>
</div> 