import type { PageLoad } from './$types';
import { CareEventListPayload } from './events/event';

export const load = (async ({ fetch }) => {
	const response = await fetch('/events');
	const payload = CareEventListPayload.parse(await response.json());
	return payload;
}) satisfies PageLoad;

// if we ssr, there's a weird flash of bad layout (specifically, header height is wrong)
// i think this is because the server can't render elements, so it thinks its zero
export const ssr = false;