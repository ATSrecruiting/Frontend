<script>
    let {cv_data} = $props()
  </script>
  
  <div class="max-w-4xl mx-auto p-4 space-y-6">
    <!-- Personal Information -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        {cv_data.first_name} {cv_data.last_name}
      </h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{cv_data.email}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{cv_data.phone_number}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{cv_data.address.street}, {cv_data.address.country}</span>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{cv_data.job_title}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{cv_data.years_of_experience} Years of Experience</span>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Work Experience -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>Work Experience</span>
      </h3>
      {#each cv_data.work_experience as job}
        <div class="mb-4 pb-4 border-b last:border-b-0">
          <h4 class="font-semibold text-lg">{job.title}</h4>
          <p class="text-gray-600">{job.company} | {job.location}</p>
          <p class="text-sm text-gray-500">
            {job.start_date} - {job.end_date || 'Present'}
          </p>
        </div>
      {/each}
    </div>
  
    <!-- Education -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
        <span>Education</span>
      </h3>
      {#each cv_data.education as edu}
        <div>
          <h4 class="font-semibold text-lg">{edu.degree}</h4>
          <p class="text-gray-600">{edu.major}</p>
          <p class="text-gray-600">{edu.school}</p>
          <p class="text-sm text-gray-500">Graduated: {edu.graduation_date}</p>
        </div>
      {/each}
    </div>
  
    <!-- Skills -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>Skills</span>
      </h3>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <h4 class="font-semibold mb-2">General Skills</h4>
          <ul class="list-disc pl-5">
            {#each cv_data.skills.general_skills as skill}
              <li>{skill}</li>
            {/each}
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Technical Skills</h4>
          <ul class="list-disc pl-5">
            {#each cv_data.skills.technical_skills as skill}
              <li>{skill}</li>
            {/each}
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Languages</h4>
          {#each cv_data.skills.languages as lang}
            <div>{lang.language} - {lang.level}</div>
          {/each}
        </div>
      </div>
    </div>
  
    <!-- Certifications -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <span>Certifications</span>
      </h3>
      {#each cv_data.certifications as cert}
        <div class="mb-2">
          <h4 class="font-semibold">{cert.certification_name}</h4>
          <p class="text-gray-600">{cert.certifier}</p>
        </div>
      {/each}
    </div>
  </div>