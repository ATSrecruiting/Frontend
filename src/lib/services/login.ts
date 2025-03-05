import type { LoginRequest, LoginResponse } from "$lib/types/login";

export async function loginUser(userData: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                error: data.detail || 'Login failed'
            };
        }
        
        return {
            success: true,
            data: {
                access_token: data.access_token,
                refresh_token: data.refresh_token
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Login failed'
        };
    }
}