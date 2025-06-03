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


export interface CertificationView {
    id: string;
    certifier: string | null;
    certification_name: string | null;
    attachments: string[]; // Keep existing attachments structure

    verifications: VerificationDetailResponse[];
}

export interface PersonalGrowthView {
    id: string;
    area_of_focus: string | null;
    activity_method: string | null;
    description: string | null;
    timeframe: string | null;
    skills_gained: string | null;
    attachments: string[]; // Keep existing attachments structure

    verifications: VerificationDetailResponse[];

}


export interface WhoAmIView {
    id: string;
    personal_statement: string | null;
    core_values: string[] | null;
    working_style: string[] | null;
    motivators: string[] | null;
    interests_passions: string[] | null;
    attachments: string[]; // Keep existing attachments structure
}

export interface SuccessStoryView {
    id: string;
    headline: string | null;
    situation: string | null;
    actions: string | null;
    results: string | null;
    skills: string[] | null;
    relevant_experience: string;
    timeframe: string;
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

export interface VerifyCertificationResponse {
    certification_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}

export interface UnVerifyCertificationResponse {
    certification_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}

export interface VerifyPersonalGrowthResponse {
    personal_growth_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}

export interface UnVerifyPersonalGrowthResponse {
    personal_growth_id: string;
    recruiter_id: number; // ID of the recruiter who performed the verification
    message: string; // Confirmation message from backend
}



export interface GetCandidateWorkExperienceResponse {
    id: string; // Assuming ID is string (UUID)
    title: string | null;
    company: string | null;
    start_date: string | null; // ISO date string
    end_date: string | null; // ISO date string
    location: string | null;
    employment_type: string | null; // e.g., Full-time, Part-time, Contract
    skills: string[] | null; // Skills related to this work experience
    key_achievements: string[] | null; // Achievements in this role
    description: string | null; // Description of the role


}

export interface ListCandidateWorkExperienceProjectsResponse {
    id : string; // Assuming ID is string (UUID)
    work_experience_id: string; // ID of the work experience this project belongs to
    project_name: string | null;
    description: string | null;
    duration: string | null; // e.g., "3 months", "6 weeks"
    team_size: number | null; // Number of people in the team
    impact: string | null; // Description of the impact made in the project
}