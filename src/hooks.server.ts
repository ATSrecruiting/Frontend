// src/hooks.server.ts
import { goto } from '$app/navigation';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    console.log('--- Hook Start ---'); // Check if hook runs at all
    const refreshToken = event.cookies.get('refresh_token');
    console.log('Hook: Found refresh_token cookie value:', refreshToken); // See the value

    if (refreshToken) {
        event.locals.user = { isAuthenticated: true };
        console.log('Hook: Set locals.user to:', event.locals.user);
    } else {
        event.locals.user = null;
        goto('/login'); // Redirect to login page if no refresh token
        console.log('Hook: Set locals.user to null');
    }

    const response = await resolve(event);
    console.log('--- Hook End ---');
    return response;
};