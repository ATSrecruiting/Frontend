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
    saveTokens(accessToken: string, refreshToken: string, expiryHours = 1): void {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
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
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) return false;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            
            if (!response.ok) {
                this.logout();
                return false;
            }
            
            const data: TokenRefreshResponse = await response.json();
            this.saveTokens(data.access_token, data.refresh_token);
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    },
    
    // Get authorization headers for API requests
    async getAuthHeaders(): Promise<HeadersInit> {
        // Check if token needs refresh
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