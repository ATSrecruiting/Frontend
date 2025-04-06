export interface UserProfile {
    user_id: number;
    recruiter_id: number | null;
    candidate_id: number | null;
    user_type: string;
    first_name: string;
    last_name: string;
    email: string;
}