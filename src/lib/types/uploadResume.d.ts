export interface UploadResumeApiResponse {
    filename: string;
    content_type: string;
    file_path: string;
    cv_data: CVData;
}


export interface CVData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: Address;
    date_of_birth: string | null;
    years_of_experience: number;
    job_title: string;
    work_experience: WorkExperience[];
    education: Education[];
    skills: SkillSet;
    certifications: Certification[];
  }

export interface Address {
    street: string;
    country: string;
  }
  
export interface WorkExperience {
    title: string;
    company: string;
    start_date: string;
    end_date: string | null;
    location: string;
  }
  
export interface Education {
    degree: string;
    major: string;
    school: string;
    graduation_date: string | null;
  }
  
export interface SkillSet {
    general_skills: string[];
    technical_skills: string[];
    languages: {
      language: string;
      level: string;
    }[];
  }
  
export interface Certification {
    certifier: string;
    certification_name: string;
  }