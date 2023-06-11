import { FIRESTORE } from './firestore';
import { parseJSONRequest } from './util';
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { type CareEventListPayload, fromDocumentSnapshot, NewCareEvent } from './event';
import { CARE_EVENT_COLLECTION_NAME } from '$lib/constants';
import type { z } from 'zod';

// get all events
export const GET = (async () => {
	const careEvents = await FIRESTORE.collection(CARE_EVENT_COLLECTION_NAME)
		.get()
		.then((querySnapshot) => querySnapshot.docs)
		.then((docSnapshots) => docSnapshots.map(fromDocumentSnapshot));

	const payload: z.infer<typeof CareEventListPayload> = {
		events: careEvents
	};

	return json(payload);
}) satisfies RequestHandler;

// create a new event (id is auto-generated). returns the new event
export const POST = (async ({ request }) => {
	const requestJSON = await parseJSONRequest(request);

	let newCareEvent: z.infer<typeof NewCareEvent>;
	try {
		newCareEvent = NewCareEvent.parse(requestJSON);
	} catch (err) {
		throw error(400, err as Error);
	}

	const collectionRef = FIRESTORE.collection(CARE_EVENT_COLLECTION_NAME);

	const docRef = await collectionRef.add(newCareEvent);

	// race condition possible here
	const snapshot = await docRef.get();

	const savedCareEvent = fromDocumentSnapshot(snapshot);

	return json(savedCareEvent);
}) satisfies RequestHandler;
