import { env } from '$env/dynamic/private';
import { Firestore } from '@google-cloud/firestore';

// global firestore client instance, for reuse
export const FIRESTORE = new Firestore({
	projectId: env.GCP_PROJECT_ID,
	credentials: {
		client_email: env.GCP_CLIENT_EMAIL,
		private_key: env.GCP_PRIVATE_KEY
	}
});
