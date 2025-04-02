export interface SubmitResumeApiRequest {
    file_id: string;
    filename: string;
    content_type: string;
    file_path: string;
    cv_data: CVDataRequest;
}

export interface CVDataRequest {
    file_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: AddressRequest;
    date_of_birth: string | null;
    years_of_experience: number;
    job_title: string;
    work_experience: WorkExperienceRequest[];
    education: EducationRequest[];
    skills: SkillSetRequest;
    certifications: CertificationRequest[];
}

export interface AddressRequest {
    street: string;
    country: string;
}

export interface WorkExperienceRequest {
    title: string;
    company: string;
    start_date: string;
    end_date: string | null;
    location: string;
    attachment_ids: string[]
}

export interface EducationRequest {
    degree: string;
    major: string;
    school: string;
    graduation_date: string | null;
    attachment_ids: string[]
}

export interface SkillSetRequest {
    general_skills: string[];
    technical_skills: string[];
    languages: {
        language: string;
        level: string;
    }[];
}


export interface CertificationRequest {
    certifier: string;
    certification_name: string;
    attachment_ids: string[]
}