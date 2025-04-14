
import { browser } from '$app/environment'





interface TokenRefreshResponse {
    access_token: string;
    refresh_token: string;
}

export const authService = {
    // Get the stored access token
    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    },

    // Get the stored refresh token
    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    },

    // Check if the user is authenticated
    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        const expiryStr = localStorage.getItem('token_expiry');

        if (!token || !expiryStr) return false;

        // Check if token is expired
        const expiry = new Date(expiryStr);
        return expiry > new Date();
    },

    // Save auth tokens
    saveAccessToken(accessToken: string, expiryHours = 1): void {
        localStorage.setItem('access_token', accessToken);


        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + expiryHours);
        localStorage.setItem('token_expiry', expiryTime.toISOString());
    },

    // Clear auth data (logout)
    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
    },

    // Refresh the access token using refresh token
    async refreshToken(): Promise<boolean> {
        if (!browser) return false;

        const apiBaseUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                await this.logout();
                return false;
            }
            const data = await response.json();

            this.saveAccessToken(data.access_token);
            return true;

        } catch (error) {
            console.error('Error refreshing token:', error);
            await this.logout();
            return false;
        }
    },


    // Get authorization headers for API requests
    async getAuthHeaders(): Promise<HeadersInit> {
        if (!browser) return {};
        const expiryStr = localStorage.getItem('token_expiry');

        if (expiryStr) {
            const expiry = new Date(expiryStr);
            const now = new Date();

            // If token expires in less than 5 minutes, refresh it
            if ((expiry.getTime() - now.getTime()) < 5 * 60 * 1000) {
                await this.refreshToken();
            }
        }

        const token = this.getAccessToken();

        if (!token) return {};

        return {
            'Authorization': `Bearer ${token}`
        };
    }
};