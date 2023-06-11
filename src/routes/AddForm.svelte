<script lang="ts">
	// import type { CareEvent } from './events/event';
	// import type { z } from 'zod';

	// export let event: z.infer<typeof CareEvent>;
	import { format, parse } from 'date-fns';

	const DATETIME_INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

	let truncatedDatetimeValue: string = formatForDateTimeInput(new Date());
	let isoDatetimeValue: string;

	$: {
		isoDatetimeValue = parse(
			truncatedDatetimeValue,
			DATETIME_INPUT_FORMAT,
			new Date()
		).toISOString();
	}

	function formatForDateTimeInput(date: Date) {
		return format(date, DATETIME_INPUT_FORMAT);
	}

	function defaultToNow(inputElement: HTMLInputElement) {
		// Format the date and time in the YYYY-MM-DDThh:mm format
		inputElement.value = formatForDateTimeInput(new Date());
	}

	let eventType = 'medication';

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

<form class="w-full p-4 rounded-lg shadow-sm bg-gray-200" method="POST" action="?/add">
	<div class="flex flex-col gap-4">
		<fieldset class="flex flex-col justify-start">
			<legend class="block text-gray-700 text-sm font-bold mb-2">What kind of thing was it?</legend>
			<div class="flex justify-start">
				<label
					for="medicationInput"
					class="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mr-2"
					class:selected={eventType === 'medication'}>Medication</label
				>
				<input
					class="appearance-none focus:outline-none"
					bind:group={eventType}
					type="radio"
					id="medicationInput"
					name="eventType"
					value="medication"
					checked
				/>

				<label
					for="foodInput"
					class="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mr-2"
					class:selected={eventType === 'food'}
				>
					Food</label
				><input
					class="appearance-none focus:outline-none"
					bind:group={eventType}
					type="radio"
					id="foodInput"
					name="eventType"
					value="food"
				/>

				<label
					for="symptomInput"
					class="bg-gray-100 text-gray-700 px-3 py-2 rounded-md"
					class:selected={eventType === 'symptom'}
				>
					Symptom</label
				>
				<input
					class="appearance-none focus:outline-none"
					bind:group={eventType}
					type="radio"
					id="symptomInput"
					name="eventType"
					value="symptom"
				/>
			</div>
		</fieldset>

		<div>
			<label for="description" class="block text-gray-700 text-sm font-bold mb-2"
				>{descriptionLabels.get(eventType)}</label
			>
			<input
				id="description"
				class="w-full px-3 py-2 rounded-md text-gray-700 bg-gray-100"
				type="text"
				name="description"
				placeholder={descriptionPlaceholders.get(eventType)}
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="event-datetime" class="block text-gray-700 text-sm font-bold"
				>{datetimeLabels.get(eventType)}</label
			>
			<input
				id="event-datetime"
				class="px-3 py-2 rounded-md text-gray-700 bg-gray-100 w-min"
				type="datetime-local"
				use:defaultToNow
				bind:value={truncatedDatetimeValue}
			/>
			<input type="hidden" name="datetime" bind:value={isoDatetimeValue} />
		</div>

		<div>
			<button
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
				type="submit"
			>
				Add Event
			</button>
		</div>
	</div>
</form>

<style>
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
