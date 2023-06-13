<script lang="ts">
	import { DATETIME_INPUT_FORMAT } from '$lib/constants';
	import { format, parse } from 'date-fns';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { z } from 'zod';
	import type { NewOrUpdatingCareEvent } from './events/event';

	export let event: z.infer<typeof NewOrUpdatingCareEvent> = {
		id: undefined,
		type: 'medication',
		description: '',
		datetime: new Date()
	};
	export let submitFunction: SubmitFunction = ({}) => {};

	$: formURL = event.id ? '?/edit' : '?/add';

	// events use Date objects, but datetime-local inputs use strings, so we gotta translate
	// when first created, the event sets the input value one time initially
	let datetimeLocalInputValue = format(event.datetime, DATETIME_INPUT_FORMAT);
	// but then, flow is reversed, and changes to input value set the event's datetime reactively
	$: event.datetime = parse(datetimeLocalInputValue, DATETIME_INPUT_FORMAT, new Date());

	const descriptionLabels = new Map([
		['medication', 'What medication was taken and how much?'],
		['food', 'What was eaten?'],
		['symptom', 'What symptom was experienced?']
	]);

	const descriptionPlaceholders = new Map([
		['medication', 'e.g. 5 mg of lorazepam'],
		['food', 'e.g. a few bites of banana'],
		['symptom', 'e.g. pain in hip']
	]);

	const datetimeLabels = new Map([
		['medication', 'When was the medication taken?'],
		['food', 'When was the food eaten?'],
		['symptom', 'When was the symptom experienced?']
	]);
</script>

<form method="POST" use:enhance={submitFunction} action={formURL}>
	{#if event.id}
		<input type="hidden" name="id" bind:value={event.id} />
	{/if}
	<div class="flex flex-col gap-4">
		<fieldset class="flex flex-col justify-start">
			<legend class="block text-gray-700 text-sm font-bold mb-2">What kind of thing was it?</legend>
			<div class="flex justify-start">
				<label
					for="medicationInput"
					class="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mr-2"
					class:selected={event.type === 'medication'}>Medication</label
				>
				<input
					class="appearance-none focus:outline-none"
					bind:group={event.type}
					type="radio"
					id="medicationInput"
					name="eventType"
					value="medication"
					checked
				/>

				<label
					for="foodInput"
					class="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mr-2"
					class:selected={event.type === 'food'}
				>
					Food</label
				><input
					class="appearance-none focus:outline-none"
					bind:group={event.type}
					type="radio"
					id="foodInput"
					name="eventType"
					value="food"
				/>

				<label
					for="symptomInput"
					class="bg-gray-100 text-gray-700 px-3 py-2 rounded-md"
					class:selected={event.type === 'symptom'}
				>
					Symptom</label
				>
				<input
					class="appearance-none focus:outline-none"
					bind:group={event.type}
					type="radio"
					id="symptomInput"
					name="eventType"
					value="symptom"
				/>
			</div>
		</fieldset>

		<div>
			<label for="description" class="block text-gray-700 text-sm font-bold mb-2"
				>{descriptionLabels.get(event.type)}</label
			>
			<input
				id="description"
				class="w-full px-3 py-2 rounded-md text-gray-700 bg-gray-100"
				type="text"
				name="description"
				placeholder={descriptionPlaceholders.get(event.type)}
				bind:value={event.description}
				required
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="event-datetime" class="block text-gray-700 text-sm font-bold"
				>{datetimeLabels.get(event.type)}</label
			>
			<input
				id="event-datetime"
				class="px-3 py-2 rounded-md text-gray-700 bg-gray-100 w-min"
				type="datetime-local"
				name="datetimeLocalInput"
				bind:value={datetimeLocalInputValue}
			/>
		</div>

		<div>
			<button
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
				type="submit"
			>
				{#if event.id}Update Event{:else}Add Event{/if}
			</button>
		</div>
	</div>
</form>

<style lang="postcss">
	.selected {
		@apply bg-blue-600 text-white;
	}

	/* All focus-visible */
	label:has(+ input[type='radio']:focus-visible) {
		@apply outline outline-2 outline-gray-500 outline-offset-2;
	}

	/* Don't show the radio buttons, we're doing custom thing */
	label + input[type='radio'] {
		@apply appearance-none;
	}

	/* don't give these appearance-none radio buttons an outline when focused  */
	label + input[type='radio']:focus-visible {
		@apply outline-none;
	}
</style>
