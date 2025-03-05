
import type { UploadResumeApiResponse } from '$lib/types/uploadResume';




export async function uploadResume(resume: File) {

    const formData = new FormData();
    formData.append('file', resume);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Resume upload failed');
        }
        
        const data: UploadResumeApiResponse = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error uploading resume:', error);
        throw error;
    }
}
