export type CandidateStatus =
    | "Applied"
    | "Screening"
    | "Interview"
    | "Technical"
    | "Offer"
    | "Hired"
    | "Rejected";

export interface ListCandidate {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    date_of_birth?: string;
    job_title: string;
    years_of_experience: number;
    status?: CandidateStatus | null;
    rating: number;
    avatar?: string;
    created_at: string;
    tags?: string[];
};

export interface ListCandidateById {
    id: number;
    first_name: string;
    last_name: string;
    job_title: string;
    years_of_experience: number;
}



export interface Attachments {
    file_path: string;
    filename: string;
}

export interface VerificationDetailResponse {
    recruiter_id: number;
    verified_at: string; // ISO date string from backend
    recruiter_name: string | null;
}

export interface WorkExperienceView {
    id: string; // Assuming ID is string (UUID)
    title: string | null;
    company: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    attachments: string[]; // Keep existing attachments structure
    // Replace is_verified and verified_by with the new verifications array
    verifications: VerificationDetailResponse[];
}

export interface EducationView {
    id: string;
    degree: string | null;
    major: string | null;
    school: string | null;
    graduation_date: string | null;
    attachments: string[]; // Keep existing attachments structure

    verifications: VerificationDetailResponse[];
}


interface Address {
    street: string;
    country: string;
}

export interface CandidatePersonalInfo {
    first_name: string;
    last_name: string;
    job_title: string;
    email: string;
    phone_number: string;
    address: Address;
    years_of_experience: number;

}


export interface VerifyWorkExperienceResponse {
    work_experience_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}

export interface UnVerifyWorkExperienceResponse {
    work_experience_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}



export interface VerifyEducationResponse {
    education_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}

export interface UnVerifyEducationResponse {
    education_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}