import { writable, type Writable } from 'svelte/store';

export const headerHeightPxStore = writable(0);

export const isAddFormOpenedStore = writable(false);

export const actionMenuEventIdStore: Writable<string | null> = writable(null);
