// src/routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    // Clear the refresh_token cookie
    cookies.delete('refresh_token', { path: '/' });
    
    // Redirect to login page
    throw redirect(303, '/login');
};