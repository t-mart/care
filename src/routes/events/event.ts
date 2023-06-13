import { z } from 'zod';

export const CareEventTypes = z.enum(['medication', 'symptom', 'food']);

export const CareEvent = z.object({
	id: z.string().min(1),
	datetime: z.coerce.date(),
	type: CareEventTypes,
	description: z.string().min(1)
});

export const NewCareEvent = CareEvent.omit({ id: true });

export const UpdatingCareEvent = NewCareEvent.partial();

export const NewOrUpdatingCareEvent = CareEvent.partial({ id: true });

export function fromDocumentSnapshot(
	snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): z.infer<typeof CareEvent> {
	return CareEvent.parse({
		id: snapshot.id,
		datetime: snapshot.get('datetime').toDate(),
		type: snapshot.get('type'),
		description: snapshot.get('description')
	});
}

export const CareEventListPayload = z.object({
	events: z.array(CareEvent)
});
