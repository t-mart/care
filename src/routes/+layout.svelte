<script>
	import Header from './Header.svelte';
	import './styles.css';
	import { headerHeightPxStore } from './stores';

	let mainMarginTopPx = 0;

	headerHeightPxStore.subscribe((newHeightPx) => {
		mainMarginTopPx = newHeightPx;
	});
</script>

<div class="max-w-prose mx-auto my-2">
	<Header />

	<main style="margin-top: {mainMarginTopPx}px;">
		<slot />
	</main>
</div>
