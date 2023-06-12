import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { FIRESTORE } from '../firestore';
import { parseJSONRequest } from '../util';
import { fromDocumentSnapshot, UpdatingCareEvent } from '../event';
import { type z, ZodError } from 'zod';

// get an event by id
export const GET = (async ({ params }) => {
	const id = params.id as string;

	const docRef = FIRESTORE.collection('care_events').doc(id);

	const snapshot = await docRef.get();

	if (!snapshot.exists) {
		throw error(404, { success: false, message: 'Care event not found' });
	}

	const careEvent = fromDocumentSnapshot(snapshot);

	return json(careEvent);
}) satisfies RequestHandler;

// update an event, and return the updated event
export const PUT = (async ({ params, request }) => {
	const id = params.id as string;
	const requestJSON = await parseJSONRequest(request);

	let updatingCareEvent: z.infer<typeof UpdatingCareEvent>;
	try {
		updatingCareEvent = UpdatingCareEvent.parse(requestJSON);
	} catch (err) {
		if (err instanceof ZodError) {
			throw error(400, { success: false, message: "Couldn't parse", issues: err.issues });
		}
		throw error(400, { success: false, message: JSON.stringify(err) });
	}

	const docRef = FIRESTORE.collection('care_events').doc(id);

	try {
		await docRef.update(updatingCareEvent);
	} catch (err) {
		throw error(404, { success: false, message: 'Care event not found' });
	}

	// race condition possible here
	const snapshot = await docRef.get();
	const careEvent = fromDocumentSnapshot(snapshot);

	return json({ success: true, event: careEvent } as JSONResponseBody);
}) satisfies RequestHandler;

// delete an event
export const DELETE = (async ({ params }) => {
	const id = params.id as string;

	const docRef = FIRESTORE.collection('care_events').doc(id);

	await docRef.delete(); // deletes always succeed, even if the doc doesn't exist

	return json({ success: true, message: 'Care event deleted' } as JSONResponseBody);
}) satisfies RequestHandler;
