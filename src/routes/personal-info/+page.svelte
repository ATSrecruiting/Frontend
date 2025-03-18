<script lang="ts">
  import EducationTree from "$lib/components/educationTree/EducationTree.svelte";
  import InfoForm from "$lib/components/persoInfo/InfoForm.svelte";
  import ExperienceTree from "$lib/components/workExperienceTree/ExperienceTree.svelte";
  import { cvData } from "$lib/stores/cvInfo";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button";
  import { updateCandidateInfo } from "$lib/services/sendinfo";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import CertificationTree from "$lib/components/certificationTree/CertificationTree.svelte";
  import FileUploadComponent from "$lib/components/attachementUpload/AttachementUpload.svelte";
  import type { SubmitResumeApiRequest } from "$lib/types/submitResume";

  let data = $state<SubmitResumeApiRequest>({
    filename: $cvData?.filename ?? "",
    content_type: $cvData?.content_type ?? "",
    file_path: $cvData?.file_path ?? "",
    cv_data: {
      first_name: $cvData?.cv_data.first_name ?? "",
      last_name: $cvData?.cv_data.last_name ?? "",
      email: $cvData?.cv_data.email ?? "",
      phone_number: $cvData?.cv_data.phone_number ?? "",
      address: $cvData?.cv_data.address ?? {
        street: "",
        country: "",
      },
      date_of_birth: $cvData?.cv_data.date_of_birth ?? "",
      years_of_experience: $cvData?.cv_data.years_of_experience ?? 0,
      job_title: $cvData?.cv_data.job_title ?? "",
      work_experience:
        $cvData?.cv_data.work_experience?.map((exp) => ({
          ...exp,
          attachment_ids: [],
        })) ?? [],
      education:
        $cvData?.cv_data.education.map((edu) => ({
          ...edu,
          attachment_ids: [],
        })) ?? [],
      skills: $cvData?.cv_data.skills ?? {
        general_skills: [],
        technical_skills: [],
        languages: [],
      },
      certifications:
        $cvData?.cv_data.certifications.map((cert) => ({
          ...cert,
          attachment_ids: [],
        })) ?? [],
    },
  });
  let userid = page.url.searchParams.get("userId");

  const handleSubmit = async () => {
    if (data) {
      try {
        const response = await updateCandidateInfo(data.cv_data, userid);
        console.log("API Response:", response);
        goto("/login");
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  let is_checked = $state(false);
</script>

<div class="flex justify-center">
  <div class="w-full max-w-3xl p-4 space-y-6">
    <InfoForm cvData={data} />
    <ExperienceTree cvData={data} />
    <EducationTree cvData={data} />
    <CertificationTree cvData={data} />

    <FileUploadComponent cvData={data} userId={userid} />

    <div class="flex items-center gap-2">
      <Checkbox bind:checked={is_checked} />
      <Label
        for="terms2"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-data-[disabled=true]:cursor-not-allowed peer-data-[disabled=true]:opacity-70"
      >
        Accept terms and conditions
      </Label>
    </div>
    <div class="mt-4">
      <Button disabled={!is_checked} onclick={handleSubmit}>Submit</Button>
    </div>
  </div>
</div>
