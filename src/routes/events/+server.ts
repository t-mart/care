import { FIRESTORE } from './firestore';
import { parseJSONRequest } from './util';
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { fromDocumentSnapshot, NewCareEvent } from './event';
import { CARE_EVENT_COLLECTION_NAME } from '$lib/constants';
import { ZodError, type z } from 'zod';

// get all events
export const GET = (async () => {
	const careEvents = await FIRESTORE.collection(CARE_EVENT_COLLECTION_NAME)
		.get()
		.then((querySnapshot) => querySnapshot.docs)
		.then((docSnapshots) => docSnapshots.map(fromDocumentSnapshot));

	return json({ success: true, events: careEvents } as JSONResponseBody);
}) satisfies RequestHandler;

// create a new event (id is auto-generated). returns the new event
export const POST = (async ({ request }) => {
	const requestJSON = await parseJSONRequest(request);

	let newCareEvent: z.infer<typeof NewCareEvent>;
	try {
		newCareEvent = NewCareEvent.parse(requestJSON);
	} catch (err) {
		if (err instanceof ZodError) {
			throw error(400, { success: false, message: "Couldn't parse", issues: err.issues });
		}
		throw error(400, { success: false, message: JSON.stringify(err) });
	}

	const collectionRef = FIRESTORE.collection(CARE_EVENT_COLLECTION_NAME);

	const docRef = await collectionRef.add(newCareEvent);

	// race condition possible here
	const snapshot = await docRef.get();

	const savedCareEvent = fromDocumentSnapshot(snapshot);

	return json({ success: true, event: savedCareEvent } as JSONResponseBody);
}) satisfies RequestHandler;
