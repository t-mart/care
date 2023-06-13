<script lang="ts">
	import { formatISO } from 'date-fns';
	import type { PageData, ActionData } from './$types';
	import Day from './Day.svelte';
	import { CareEventListPayload, type CareEvent } from './events/event';
	import type { z } from 'zod';
	import AddForm from './AddForm.svelte';
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

	async function refresh() {
		const response = await fetch('/events');
		const newData = await response.json().then((newData) => {
			return CareEventListPayload.parse(newData);
		});
		console.log('refreshed', newData);
		data = newData;
	}

	let isAddFormOpened = false;

	isAddFormOpenedStore.subscribe((value) => {
		isAddFormOpened = value;
	});
</script>

<svelte:head>
	<title>Care for Tim Martin</title>
	<meta name="description" content="Care for Tim Martin" />
</svelte:head>

<div class="flex flex-col gap-4 py-4">
	{#if isAddFormOpened}
		<AddForm />
	{/if}
	<ol class="flex flex-col gap-4 w-full px-4">
		{#each Array.from(dateBuckets.entries()) as [date, eventsInDate] (date)}
			<li><Day events={eventsInDate} /></li>
		{/each}
	</ol>
</div>
