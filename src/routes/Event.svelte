<script lang="ts">
	import type { CareEvent } from './events/event';
	import type { z } from 'zod';
	import { openedEditMenuEventIdStore } from './stores';
	import { enhance } from '$app/forms';

	export let event: z.infer<typeof CareEvent>;
	export let editMenuIsOpen = false;

	openedEditMenuEventIdStore.subscribe((newId) => {
		editMenuIsOpen = newId === event.id;
	});

	function handleToggleEditMenuClick() {
		if (editMenuIsOpen) {
			openedEditMenuEventIdStore.set(null);
		} else {
			openedEditMenuEventIdStore.set(event.id);
		}
	}

	let emojiTypeMap = new Map([
		['food', '🍔'],
		['medication', '💊'],
		['symptom', '🤒']
	]);
</script>

<div class="flex gap-2 justify-between">
	<div class="flex gap-2">
		<button
			on:click={handleToggleEditMenuClick}
			class="underline"
		>
			{event.datetime.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric'
			})}
		</button>
		<div>{emojiTypeMap.get(event.type)}</div>
		<div>{event.description}</div>
	</div>
	{#if editMenuIsOpen}
		<form class="flex gap-2" method="POST" use:enhance>
			<input type="hidden" name="id" value={event.id} />
			<button class="underline" formaction="?/edit">Edit</button>
			<button class="underline" formaction="?/delete">Delete</button>
		</form>
	{/if}
</div>
