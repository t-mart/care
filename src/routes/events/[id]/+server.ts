import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { FIRESTORE } from '../firestore';
import { parseJSONRequest } from '../util';
import { fromDocumentSnapshot, UpdatingCareEvent } from '../event';
import type { z } from 'zod';

// get an event by id
export const GET = (async ({ params }) => {
	const id = params.id as string;

	const docRef = FIRESTORE.collection('care_events').doc(id);

	const snapshot = await docRef.get();

	if (!snapshot.exists) {
		throw error(404, 'Care event not found');
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
		throw error(400, err as Error);
	}

	const docRef = FIRESTORE.collection('care_events').doc(id);

	try {
		await docRef.update(updatingCareEvent);
	} catch (err) {
		throw error(404, 'Care event not found');
	}

	// race condition possible here
	const snapshot = await docRef.get();
	const careEvent = fromDocumentSnapshot(snapshot);

	return json(careEvent);
}) satisfies RequestHandler;

// delete an event
export const DELETE = (async ({ params }) => {
	const id = params.id as string;

	const docRef = FIRESTORE.collection('care_events').doc(id);

	await docRef.delete(); // deletes always succeed, even if the doc doesn't exist

	return json({ message: 'Care event deleted' });
}) satisfies RequestHandler;
