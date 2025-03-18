
import type { ListCandidate, CandidatePersonalInfo, WorkExperienceView } from '$lib/types/candidates';

export async function listCandidates(page_size: number, page: number): Promise<ListCandidate[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates?page_size=${page_size}&page=${page}`);

    if (!response.ok) {
        throw new Error('Failed to fetch candidates');
    }

    return response.json();
}



export async function getCandidatePersonalInfo(candidateId: string): Promise<CandidatePersonalInfo> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/${candidateId}/personal_info`);

    if (!response.ok) {
        throw new Error('Failed to fetch candidate personal info');
    }

    return response.json();
}


export async function getCandidateWorkExperience(candidateId: string): Promise<WorkExperienceView[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/${candidateId}/work_experience`);

    if (!response.ok) {
        throw new Error('Failed to fetch candidate personal info');
    }

    return response.json();
}