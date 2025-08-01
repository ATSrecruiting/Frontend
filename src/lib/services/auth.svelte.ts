import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import type { LoginRequest } from "$lib/types/login";
import type { UserProfile } from "$lib/types/user";






class AuthStore {
    user = $state<UserProfile | null>(null);
    isAuthenticated = $state(false);
    loading = $state(false);


    condtructor() {
        if (browser) {
            this.loadUserFromStorage();
        }
    }

    async login(userData: LoginRequest) {
        this.loading = true;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                this.setUser(data.user);
                this.saveAccessToken(data.access_token);
                console.log('Login successful:', data.user.user_type);
                if (data.user.user_type === "recruiter") {
                    goto("/dashboard"); // Navigate both types to dashboard
                } else if (data.user.user_type === "candidate") {
                    goto(`/dashboard/candidates/${data.user.candidate_id}`); // Navigate both types to dashboard
                }
            } else {
                throw new Error(`Login failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
        finally {
            this.loading = false;
        }

    }

    saveAccessToken(accessToken: string, expiryHours = 1): void {
        localStorage.setItem('access_token', accessToken);


        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + expiryHours);
        localStorage.setItem('token_expiry', expiryTime.toISOString());
    }



    logout() {
        // Clear localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        
        // Navigate to logout endpoint which will clear cookies and redirect
        goto('/logout');
    }

    setUser(user: UserProfile | null) {
        this.user = user;
        this.isAuthenticated = !!user;
        if (browser) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    loadUserFromStorage() {
        const accessToken = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        if (accessToken && user) {
            try {
                this.user = JSON.parse(user);
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Failed to parse user from storage:', error);
                this.logout();
            }
        }
    }

    checkUserAccountType(requiredType: string): boolean {
        if (!this.user) return false;
        return this.user.user_type === requiredType;
    }

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
    }

    async getAuthHeaders(): Promise<HeadersInit> {
        if (!browser) return {};
        const expiryStr = localStorage.getItem('token_expiry');

        if (expiryStr) {
            const expiry = new Date(expiryStr);
            const now = new Date();
            if (expiry <= now) {
                await this.refreshToken();
            }
        }

        const accessToken = localStorage.getItem('access_token');
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    }
}



export const authStore = new AuthStore();