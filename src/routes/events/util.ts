import { error } from '@sveltejs/kit';

export async function parseJSONRequest(request: Request) {
	let requestJSON;
	try {
		requestJSON = await request.json();
	} catch (err) {
		throw error(400, `Invalid JSON body: ${(err as SyntaxError).message}`);
	}
	return requestJSON;
}
