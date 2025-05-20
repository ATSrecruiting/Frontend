export interface UploadResumeApiResponse {
  file_id: string;
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
  personal_growth: PersonalGrowth[];
  who_am_i: WhoAmI;
  success_stories: SuccessStory[];
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

export interface PersonalGrowth {
    area_of_focus: string;
    activity_method: string;
    description: string;
    timeframe: string;
    skills_gained: string[];
}

export interface WhoAmI {
  personal_statement: string;
  core_values: string[];
  working_style: string[];
  motivators: string[];
  interests_passions: string[];
}


  export interface SuccessStory{
    headline: string;
    situation: string;
    actions: string;
    results: string;
    skills: string[];
    relevant_experience: string;
    timeframe: string;
  };