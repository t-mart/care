import type { Actions } from './$types';

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		console.log(`yo, you addin now dawg, ${data.get('datetime')}`);
	}
} satisfies Actions;
