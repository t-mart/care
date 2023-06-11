# svelte pages

- `+page.svelte` - page template

- `+page.ts` - exports a load function that returns the page data for the template. can be run on
  the server or client.

  According to the [SvelteKit docs](<https://kit.svelte.dev/docs/page-options>):

  > By default, SvelteKit will render (or prerender) any component first on the server and send it
  > to the client as HTML. It will then render the component again in the browser to make it
  > interactive in a process called hydration. For this reason, you need to ensure that components
  > can run in both places.

  Can also specify page options that effect where the template is rendered.

- `+page.server.ts` - also exports a load function, but only runs on the server.

  Can also specify page options that effect where the template is rendered.

- `+server.ts` - exports GET, POST, PUT, DELETE, PATCH, and HEAD functions that run on the server.
  In other words, this is where you can define API endpoints.
