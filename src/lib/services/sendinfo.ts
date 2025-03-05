import type { CVData } from "$lib/types/uploadResume";



export async function updateCandidateInfo(candidateData: CVData, userId: string | null) {
    // Make sure years_of_experience is a number (float)
    if (candidateData.years_of_experience && typeof candidateData.years_of_experience === 'string') {
      candidateData.years_of_experience = parseFloat(candidateData.years_of_experience) || 0;
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/personal_info?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Personal info could not be saved');
    }
    
    return response.json();
  }