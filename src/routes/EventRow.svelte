<script lang="ts">
	import type { CareEvent } from './events/event';
	import type { z } from 'zod';
	import { actionMenuEventIdStore, isAddFormOpenedStore } from './stores';
	import { enhance } from '$app/forms';
	import EventForm from './EventForm.svelte';
	import { utcToZonedTime } from 'date-fns-tz';
	import { PATIENT_TIMEZONE } from '$lib/constants';

	export let event: z.infer<typeof CareEvent>;
	let isEditing = false;
	$: eventDatetimeInPatientTZ = utcToZonedTime(event.datetime, PATIENT_TIMEZONE);

	function handleToggleActionMenuClick() {
		isEditing = false;
		actionMenuEventIdStore.update((id) => {
			// toggle: if we're the currently opened id, nullify, else set to our id
			return id === event.id ? null : event.id;
		});
	}

	function handleEditClick() {
		isEditing = !isEditing;
		isAddFormOpenedStore.set(false); // too busy with two forms open at once
	}

	$: actionMenuIsOpen = $actionMenuEventIdStore === event.id;

	let emojiTypeMap = new Map([
		['food', '🍔'],
		['medication', '💊'],
		['symptom', '🤒']
	]);
</script>

<div class="flex flex-col gap-2" class:edit-menu-open={actionMenuIsOpen}>
	<div class="flex gap-2 justify-between px-4">
		<div class="flex gap-2 items-center">
			<button on:click={handleToggleActionMenuClick} class="underline min-w-max">
				{eventDatetimeInPatientTZ.toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: 'numeric'
				})}
			</button>
			<div>{emojiTypeMap.get(event.type)}</div>
			<div>{event.description}</div>
		</div>
		{#if actionMenuIsOpen}
			<div class="flex gap-2 text-white text-xs items-center">
				<button
					class="flex gap-1 items-center bg-gray-600 hover:bg-yellow-700 rounded-md px-2 py-1"
					on:click={handleEditClick}
					><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em">
						<path
							fill="currentColor"
							d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
						/>
					</svg><span class="font-bold">Edit</span></button
				>
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="id" value={event.id} />
					<button
						class="flex gap-1 items-center bg-gray-600 hover:bg-red-700 rounded-md px-2 py-1"
						type="submit"
						><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="1em"
							><path
								fill="currentColor"
								d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
							/></svg
						><span class="font-bold">Delete</span></button
					>
				</form>
			</div>
		{/if}
	</div>
	{#if isEditing && actionMenuIsOpen}
		<div class="px-4">
			<EventForm
				{event}
				submitFunction={({}) => {
					isEditing = false;
				}}
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	.edit-menu-open {
		@apply border rounded-lg border-none bg-gray-200 py-4 shadow-md my-2;
	}
</style>
