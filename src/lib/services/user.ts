
import { goto } from '$app/navigation';
import { authService } from './auth';
import type { UserProfile } from '$lib/types/user';


export async function getLoggedUser(): Promise<UserProfile> {
    // Get authentication headers from the auth service
    const headers = await authService.getAuthHeaders();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/user`,
        {
            method: 'GET',
            headers // Include the auth headers in the request
        }
    );

    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return getLoggedUser();
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to verify work experience');
    }

    return response.json();
}