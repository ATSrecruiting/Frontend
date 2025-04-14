import type { LoginRequest, LoginResponse } from "$lib/types/login";

export async function loginUser(userData: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return {

            access_token: data.access_token,
            account_type: data.account_type
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
}