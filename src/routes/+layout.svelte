<script>
	import Header from './Header.svelte';
	import './styles.css';
	import { headerHeightPxStore } from './stores';
</script>

<div class="max-w-prose mx-auto my-2">
	<Header />

	<main style="margin-top: {$headerHeightPxStore}px;">
		<slot />
	</main>
</div>
