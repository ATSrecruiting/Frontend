import { writable } from 'svelte/store';
import type { UploadResumeApiResponse } from '$lib/types/uploadResume';
export const cvData = writable<UploadResumeApiResponse | null>(null);