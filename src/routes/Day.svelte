<script lang="ts">
	import type { CareEvent } from './events/event';
	import type { z } from 'zod';
	import Event from './Event.svelte';

	export let events: z.infer<typeof CareEvent>[];
	let date: string;

	$: {
		let refEvent: z.infer<typeof CareEvent>;
		if (events.length > 0) {
			refEvent = events[0];
		} else {
			throw new Error('No events passed to Day.svelte');
		}

		date = refEvent.datetime.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div>
	<h2 class="text-xl font-semibold text-gray-700">{date}</h2>
	<ul>
		{#each events as event}
			<li>
				<Event {event} />
			</li>
		{/each}
	</ul>
</div>
