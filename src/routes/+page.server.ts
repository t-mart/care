import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { CareEventListPayload } from './events/event';
import { fail } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
	const response = await fetch('/events');
	const json = await response.json();
	const payload = CareEventListPayload.parse(json);
	return payload;
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request, fetch }) => {
		const data = await request.formData();

		// just do rough structuring here, validation will happen on the server
		const newEvent = {
			datetime: data.get('datetimeLocalInput'),
			type: data.get('eventType'),
			description: data.get('description')
		};

		const response = await fetch('/events', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newEvent)
		});
		const json = await response.json();

		if (!response.ok) {
			return fail(400, json);
		}
		return json;
	},
	edit: async ({ request, fetch }) => {
		const data = await request.formData();
		const updatedEvent = {
			datetime: data.get('datetimeLocalInput') || undefined,
			type: data.get('eventType') || undefined,
			description: data.get('description') || undefined
		};

		const response = await fetch(`/events/${data.get('id')}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedEvent)
		});

		if (!response.ok) {
			return fail(400, { success: false, message: 'Failed to update' });
		}
		return { success: true, message: 'updated' };
	},
	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id');

		const response = await fetch(`/events/${id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			return fail(400, { success: false, message: 'Failed to delete' });
		}
		return { success: true, message: 'deleted' };
	}
} satisfies Actions;

// if we ssr, there's a weird flash of bad layout (specifically, header height is wrong)
// i think this is because the server can't render elements, so it thinks its zero
export const ssr = false;
