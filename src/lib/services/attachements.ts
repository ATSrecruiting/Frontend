import { goto } from "$app/navigation";
import type { Attachments } from "$lib/types/attachments";
import { authService } from "./auth";















export async function getWorkexperienceAttachments(
    attachments_ids: string[],
): Promise<Attachments[]> {
    const baseHeaders = await authService.getAuthHeaders();
    const headers = {
        ...baseHeaders,
        "Content-Type": "application/json",
    };
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/batch_download`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                attachments_ids,
            }),
        }

    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getWorkexperienceAttachments(attachments_ids); 
            } else {
                goto("/login");
                throw new Error("Authentication expired. Please login again.");
            }
        }
        
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); 
}


