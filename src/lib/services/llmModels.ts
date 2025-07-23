import type { ListOpenRouterModelsResponse, UserSelectedModel } from "$lib/types/llm-models";
import type { List } from "lucide-svelte";
import { authStore } from "./auth.svelte";
import { goto } from "$app/navigation";







export async function getOpenRouterModels(): Promise<ListOpenRouterModelsResponse[]> {
    // Get authentication headers from the auth service
    const headers = await authStore.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/llm_models`,
        {
            headers // Include the auth headers in the request
        }
    );
    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authStore.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return getOpenRouterModels();
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to fetch OpenRouter models');
    }

    return response.json();
}




export async function getUserSelectedModel(): Promise<UserSelectedModel> {
    // Get authentication headers from the auth service
    const headers = await authStore.getAuthHeaders();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/llm_models/user_selected`,
        {
            headers // Include the auth headers in the request
        }
    );

    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authStore.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return getUserSelectedModel();
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to fetch candidate personal info');
    }

    return response.json();
}


