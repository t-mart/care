<script lang="ts">
	import HeadShake from './HeadShake.svelte';
	import { headerHeightPxStore, isAddFormOpenedStore, actionMenuEventIdStore } from './stores';

	function handleAddClick() {
		actionMenuEventIdStore.set(null);
		isAddFormOpenedStore.update((value) => {
			const newValue = !value;
			if (newValue) {
				// scroll to top
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
			return newValue;
		});
	}
</script>

<header
	class="fixed top-0 left-0 w-full h-min bg-gray-200 z-10 py-2 flex items-center justify-center shadow-md"
	bind:clientHeight={$headerHeightPxStore}
>
	<div class="flex justify-between max-w-prose w-[65ch] px-4">
		<div class="flex items-center">
			<HeadShake />
			<h1 class="ml-4 text-2xl font-bold text-gray-700">Care for Tim Martin</h1>
		</div>
		<div class="flex items-center gap-2 text-white">
			<button
				class="bg-blue-600 hover:bg-blue-700 rounded-md flex justify-center items-center gap-1 px-3 py-2"
				class:opened={$isAddFormOpenedStore}
				on:click={handleAddClick}
				><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
					><path
						fill="currentColor"
						d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
					/></svg
				><span class="font-bold">Add</span></button
			>
		</div>
	</div>
</header>

<style lang="postcss">
	.opened {
		@apply bg-gray-700;
	}

	.opened:hover {
		@apply bg-gray-500;
	}
</style>
