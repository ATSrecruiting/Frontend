// src/routes/login/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Server-side load function for the /login route.
 *
 * This function checks if the user is already authenticated.
 * If the user is authenticated, it redirects them to the /dashboard page.
 * Otherwise, it allows the login page to load normally.
 */
export const load: PageServerLoad = async ({ locals }) => {
    // Check if the user object exists on locals and if they are authenticated
    if (locals.user?.isAuthenticated) {
        // If authenticated, redirect to the dashboard
        // Using 303 status code (See Other) is common for this type of redirect
        throw redirect(303, '/dashboard');
    }

    // If the user is not authenticated, return an empty object
    // to allow the +page.svelte component for /login to render.
    // You could also return props needed by your login page here.
    return {};
};