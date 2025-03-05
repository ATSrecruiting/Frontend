<script>
  import EducationTree from "$lib/components/educationTree/EducationTree.svelte";
  import InfoForm from "$lib/components/persoInfo/InfoForm.svelte";
  import ExperienceTree from "$lib/components/workExperienceTree/ExperienceTree.svelte";
  import {cvData} from "$lib/stores/cvInfo";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button";
  import { updateCandidateInfo } from '$lib/services/sendinfo';
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import CertificationTree from "$lib/components/certificationTree/CertificationTree.svelte";





  let data = $state($cvData)
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
  }

  let is_checked = $state(false);




</script>

<div class="flex justify-center">
  <div class="w-full max-w-3xl p-4 space-y-6">
    {#if data}
      <InfoForm cvData={data} />
      <ExperienceTree cvData={data} />
      <EducationTree cvData={data} />
      <CertificationTree cvData={data} />
    {/if}

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
