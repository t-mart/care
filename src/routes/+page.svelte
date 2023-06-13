<script lang="ts">
	import { formatISO } from 'date-fns';
	import type { PageData } from './$types';
	import Day from './Day.svelte';
	import type { CareEvent } from './events/event';
	import type { z } from 'zod';
	import EventForm from './EventForm.svelte';
	import { isAddFormOpenedStore } from './stores';

	// don't change these names, they are used by the framework
	export let data: PageData;
	// export let form: ActionData;

	let dateBuckets: Map<String, z.infer<typeof CareEvent>[]> = new Map();

	$: {
		// we may be getting new events or events' datetimes may change, so we need a clean slate
		dateBuckets.clear();

		// sort events in reverse chronological order first, before bucketing.
		// this means that, when we insert into buckets that same order is preserved.
		// and with Map, iteration order is insertion order, for when we iterate over the buckets later.
		data.events.sort((a, b) => {
			return b.datetime.getTime() - a.datetime.getTime();
		});

		data.events.forEach((event) => {
			const key = formatISO(event.datetime, { representation: 'date' });
			let events = dateBuckets.get(key);
			if (!events) {
				events = [];
				dateBuckets.set(key, events);
			}
			events.push(event);
		});

		dateBuckets = dateBuckets; // fake reactivity
	}
</script>

<svelte:head>
	<title>Care for Tim Martin</title>
	<meta name="description" content="Care for Tim Martin" />
</svelte:head>

<div class="flex flex-col gap-4 py-4">
	{#if $isAddFormOpenedStore}
		<div class="p-4 rounded-lg shadow-md bg-gray-200">
			<EventForm
				submitFunction={({}) => {
					isAddFormOpenedStore.set(false);
				}}
			/>
		</div>
	{/if}
	<ol class="flex flex-col gap-4 w-full">
		{#each Array.from(dateBuckets.entries()) as [date, eventsInDate] (date)}
			<li><Day events={eventsInDate} /></li>
		{/each}
	</ol>
</div>
