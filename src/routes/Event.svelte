<script lang="ts">
	import type { CareEvent } from './events/event';
	import type { z } from 'zod';

	export let event: z.infer<typeof CareEvent>;
</script>

<div class="flex gap-2">
	<div>
		{event.datetime.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		})}
	</div>
	<div>{event.type}</div>
	<div>{event.description}</div>
</div>
