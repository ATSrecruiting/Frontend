import { writable } from 'svelte/store';

export const candidateList = writable<number[]>([]);