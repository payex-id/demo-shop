<script>
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
	<main class="flex-grow pb-16">
		<slot />
	</main>
	
	<footer class="fixed bottom-0 left-0 right-0 bg-gray-100 py-4">
		<div class="container mx-auto px-4 flex justify-center space-x-6">
			<a 
				href="/demo.zip"
				target="_blank" 
				rel="noopener noreferrer"
				class="text-gray-600 hover:text-gray-900 transition-colors"
			>
				Sources on GitHub
			</a>
			<a 
				href="https://app.payex.id/merchant-docs"
				target="_blank" 
				rel="noopener noreferrer"
				class="text-gray-600 hover:text-gray-900 transition-colors"
			>
				PayEx docs
			</a>
		</div>
	</footer>
</div> 


