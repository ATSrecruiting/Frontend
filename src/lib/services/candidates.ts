import type { ListCandidate, CandidatePersonalInfo, WorkExperienceView, ListCandidateById, VerifyWorkExperienceResponse, UnVerifyWorkExperienceResponse, EducationView, VerifyEducationResponse, UnVerifyEducationResponse, CertificationView, UnVerifyCertificationResponse, PersonalGrowthView, UnVerifyPersonalGrowthResponse, WhoAmIView, SuccessStoryView } from '$lib/types/candidates';
import { authService } from './auth';
import { goto } from '$app/navigation';

export async function listCandidates(page_size: number, page: number): Promise<ListCandidate[]> {
    // Get authentication headers from the auth service
    const headers = await authService.getAuthHeaders();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates?page_size=${page_size}&page=${page}`,
        {
            headers // Include the auth headers in the request
        }
    );

    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return listCandidates(page_size, page);
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to fetch candidates');
    }

    return response.json();
}


export async function listCandidatesById(session_id: string | null): Promise<ListCandidateById[]> {
    if (session_id === null) {
        throw new Error('Session ID is required');
    }
    // Get authentication headers from the auth service
    const headers = await authService.getAuthHeaders();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/by_id?session_id=${session_id}`,
        {
            headers // Include the auth headers in the request
        }
    );

    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return listCandidatesById(session_id);
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to fetch candidates');
    }

    return response.json();
}

export async function listCandidatesWithSimilaritySearch(page_size: number, page: number, search: string): Promise<ListCandidate[]> {
    // Get authentication headers from the auth service
    const headers = await authService.getAuthHeaders();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/similarity_search?page_size=${page_size}&page=${page}&search=${search}`,
        {
            headers // Include the auth headers in the request
        }
    );
    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return listCandidates(page_size, page);
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to fetch candidates');
    }

    return response.json();
}



export async function getCandidatePersonalInfo(candidateId: string): Promise<CandidatePersonalInfo> {
    // Get authentication headers from the auth service
    const headers = await authService.getAuthHeaders();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/personal_info`,
        {
            headers // Include the auth headers in the request
        }
    );

    if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
            // If unauthorized, try refreshing the token once
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                // Retry the request with new token
                return getCandidatePersonalInfo(candidateId);
            } else {
                goto('/login');
                throw new Error('Authentication expired. Please login again.');
            }
        }
        throw new Error('Failed to fetch candidate personal info');
    }

    return response.json();
}

// Fetch work experience - return type updated
export async function getCandidateWorkExperience(
    candidateId: string,
): Promise<WorkExperienceView[]> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/work_experience`,
        { headers },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getCandidateWorkExperience(candidateId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Consider more specific error handling based on status codes if needed
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); // Return data matching WorkExperienceView[]
}

export async function getCandidateEducation(
    candidateId: string,
): Promise<EducationView[]> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/education`,
        { headers },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getCandidateEducation(candidateId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Consider more specific error handling based on status codes if needed
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); // Return data matching WorkExperienceView[]
}


export async function getCandidateCertification(
    candidateId: string,
): Promise<CertificationView[]> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/certification`,
        { headers },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getCandidateCertification(candidateId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Consider more specific error handling based on status codes if needed
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); // Return data matching WorkExperienceView[]
}

export async function getCandidatePersonalGrowth(
    candidateId: string,
): Promise<PersonalGrowthView[]> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/personal_growth`,
        { headers },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getCandidatePersonalGrowth(candidateId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Consider more specific error handling based on status codes if needed
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); // Return data matching WorkExperienceView[]
}

export async function getCandidateSuccessStories(
    candidateId: string,
): Promise<SuccessStoryView[]> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/success_stories`,
        { headers },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getCandidateSuccessStories(candidateId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Consider more specific error handling based on status codes if needed
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); // Return data matching WorkExperienceView[]
}


export async function getCandidateWhoAmI(
    candidateId: string,
): Promise<WhoAmIView> {
const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/who_am_i`,
        { headers },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return getCandidateWhoAmI(candidateId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Consider more specific error handling based on status codes if needed
        console.error(`API Error ${response.status}: ${await response.text()}`);
        throw new Error("Failed to fetch candidate work experience");
    }

    return response.json(); // Return data matching WorkExperienceView[]
}




export async function verifyWorkExperience(
    candidateId: string,
    workExperienceId: string,
): Promise<VerifyWorkExperienceResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/work_experience/${workExperienceId}/verify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return verifyWorkExperience(candidateId, workExperienceId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json(); // Return data matching VerifyWorkExperienceResponse
}



export async function unverifyWorkExperience(
    candidateId: string,
    workExperienceId: string,
): Promise<UnVerifyWorkExperienceResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/work_experience/${workExperienceId}/unverify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return verifyWorkExperience(candidateId, workExperienceId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json(); // Return data matching VerifyWorkExperienceResponse
}




export async function verifyEducation(
    candidateId: string,
    educationId: string,
): Promise<VerifyEducationResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/education/${educationId}/verify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return verifyEducation(candidateId, educationId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}


export async function unverifyEducation(
    candidateId: string,
    educationId: string,
): Promise<UnVerifyEducationResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/education/${educationId}/verify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return unverifyEducation(candidateId, educationId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}



export async function verifyCertification(
    candidateId: string,
    certificationId: string,
): Promise<UnVerifyCertificationResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/certification/${certificationId}/verify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return verifyCertification(candidateId, certificationId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}


export async function unverifyCertification(
    candidateId: string,
    certificationId: string,
): Promise<UnVerifyCertificationResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/certification/${certificationId}/unverify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return unverifyCertification(candidateId, certificationId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}


export async function verifyPersonalGrowth(
    candidateId: string,
    personalGrowthId: string,
): Promise<VerifyWorkExperienceResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/personal_growth/${personalGrowthId}/verify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return verifyPersonalGrowth(candidateId, personalGrowthId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}

export async function unverifyPersonalGrowth(
    candidateId: string,
    personalGrowthId: string,
): Promise<UnVerifyPersonalGrowthResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/personal_growth/${personalGrowthId}/unverify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return unverifyPersonalGrowth(candidateId, personalGrowthId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}


export async function verifySuccessStory(
    candidateId: string,
    successStoryId: string,
): Promise<VerifyWorkExperienceResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/success_story/${successStoryId}/verify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return verifySuccessStory(candidateId, successStoryId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}

export async function unverifySuccessStory(
    candidateId: string,
    successStoryId: string,
): Promise<UnVerifyPersonalGrowthResponse> {
    const headers = await authService.getAuthHeaders();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/${candidateId}/success_story/${successStoryId}/unverify`,
        {
            method: "PUT",
            headers,
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
                return unverifySuccessStory(candidateId, successStoryId); // Retry
            } else {
                goto("/login"); // Redirect to login if refresh fails
                throw new Error("Authentication expired. Please login again.");
            }
        }
        // Handle potential conflict (e.g., 409 if already verified by this user, though backend might just return success)
        // Handle other errors
        const errorBody = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error(`API Error ${response.status}:`, errorBody);
        throw new Error(errorBody.detail || "Failed to verify work experience");
    }

    return response.json();
}