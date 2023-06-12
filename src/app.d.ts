// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { type z } from 'zod';

declare global {
	interface JSONResponseBody {
		success: boolean;
	}
	namespace App {
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		// since were doing a lot of JSON validation, we'll add a custom error type
		interface Error extends JSONResponseBody {
			success: false;
			issues?: (z.ZodIssue | string)[];
		}
	}
}

export {};
