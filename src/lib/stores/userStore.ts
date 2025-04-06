import { writable } from "svelte/store";
import type { UserProfile } from "$lib/types/user";



export const userStore = writable<UserProfile | null>(null);

