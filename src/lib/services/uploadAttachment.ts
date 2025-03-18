
import type { AttachmentUploadApiResponse } from '$lib/types/uploadAttachments';




export async function uploadAttachments(file: File) {

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Resume upload failed');
        }

        const data: AttachmentUploadApiResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error uploading resume:', error);
        throw error;
    }
}
