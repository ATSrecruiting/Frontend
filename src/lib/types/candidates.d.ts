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

export interface Attachments {
    file_path: string;
    filename: string;
}



export interface WorkExperienceView {
    title: string | null;
    company: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    attachments: Attachments[];
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