<script lang="ts">
	import type { CareEvent } from './events/event';
	import type { z } from 'zod';

	export let event: z.infer<typeof CareEvent>;

	let emojiTypeMap = new Map([
		['food', '🍔'],
		['medication', '💊'],
		['symptom', '🤒']
	]);
</script>

<div class="flex">
	<button class="text-gray-400 hover:text-gray-600">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 40 40"
			fill="currentColor"
		>
			<circle cx="20" cy="12" r="3" />
			<circle cx="20" cy="20" r="3" />
			<circle cx="20" cy="28" r="3" />
		</svg>
	</button>
	<div class="flex gap-2">
		<div>
			{event.datetime.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric'
			})}
		</div>
		<div>{emojiTypeMap.get(event.type)}</div>
		<div>{event.description}</div>
	</div>
</div>
