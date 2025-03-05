<script lang="ts">
import ExperienceList from '$lib/components/experienceList/ExperienceList.svelte';
      import type { UploadResumeApiResponse } from '$lib/types/uploadResume';


const mockData: UploadResumeApiResponse = {
  filename: "john_doe_resume.pdf",
  content_type: "application/pdf",
  file_path: "/uploads/resumes/john_doe_resume.pdf",
  cv_data: {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@example.com",
    phone_number: "+1234567890",
    address: {
    street: "123 Main St, Apt 4B",
    country: "USA"
    },
    date_of_birth: "1990-05-15",
    years_of_experience: 8,
    job_title: "Software Engineer",
    work_experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      start_date: "2017-03-01",
      end_date: null,
      location: "New York, NY"
    },
    {
      title: "Software Engineer",
      company: "Dev Solutions Ltd.",
      start_date: "2014-06-01",
      end_date: "2017-02-28",
      location: "San Francisco, CA"
    }
    ],
    education: [
    {
      degree: "Bachelor of Science",
      major: "Computer Science",
      school: "University of California",
        graduation_date: "2014-05-01"
      }
    ],
    skills: {
      general_skills: ["Team Leadership", "Project Management", "Problem Solving"],
      technical_skills: ["JavaScript", "Python", "Go", "React", "Node.js"],
      languages: [
        {
          language: "English",
          level: "Native"
        },
        {
          language: "Spanish",
          level: "Intermediate"
        }
      ]
    },
    certifications: [
      {
        certifier: "Oracle",
        certification_name: "Oracle Certified Java Programmer"
      },
      {
        certifier: "Microsoft",
        certification_name: "Microsoft Certified: Azure Developer Associate"
      }
    ]
  }
};
</script>

<div class="grid place-items-center">
    <div>

        <ExperienceList cv_data={mockData.cv_data} />
        
    </div>
</div>