// src/hooks.server.js
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Check for the refresh token cookie
    const refreshToken = event.cookies.get('refresh_token'); // Use the name you set in FastAPI

    // 2. Populate event.locals based on cookie presence
    if (refreshToken) {
        // Basic Check: If the cookie exists, we assume the user *might* be
        // authenticated server-side for initial page load purposes.
        // Robust validation will still happen client-side via authService.refreshToken
        // when API calls requiring fresh access tokens are made.
        // You could add server-side validation here (Option 2 in previous thoughts)
        // by calling a backend endpoint if stricter checks per-request are needed.
        event.locals.user = {
            isAuthenticated: true
            // You could potentially decode the refresh token HERE if it's a JWT
            // and you have the secret key, to add more user details to locals,
            // BUT be cautious about doing heavy validation on every single request.
        };
        // console.log('Hook: Refresh token cookie found, setting locals.user');
    } else {
        event.locals.user = null; // No cookie = definitely not logged in server-side
        // console.log('Hook: Refresh token cookie NOT found, locals.user is null');
    }

    // 3. Continue processing the request (runs page/layout loads, endpoints, etc.)
    // `resolve(event)` passes the modified `event` (with `locals.user`) down the line.
    const response = await resolve(event);

    // 4. (Optional) Add security headers here if needed
    // response.headers.set('X-Frame-Options', 'DENY');

    return response;
};