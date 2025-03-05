<script lang="ts">
  import Upload from "$lib/components/upload/Upload.svelte";
  import { Button } from "$lib/components/ui/button";
  import { uploadResume } from "$lib/services/uploadResume";
  import { goto } from "$app/navigation";
  import { cvData } from "$lib/stores/cvInfo";
  import { page } from "$app/state";

  let value = $state<File[]>([]);
  let is_uploading = $state(false);
  let userId = page.url.searchParams.get("userId");


  const handleSubmit = async () => {
    try {
      is_uploading = true;
      const response = await uploadResume(value[0]);
      cvData.set(response);
      goto("/personal-info?userId=" + userId);
    } catch (error) {
      is_uploading = false;
      alert(error instanceof Error ? error.message : "Upload failed");
    }
  };
</script>

<div class="flex justify-center items-center min-h-screen">
  <div class="w-1/2 max-w-md">
    <Upload {value} />

    {#if value.length > 0}
      <div class="mt-4 flex justify-center">
        {#if is_uploading}
          <Button>
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
          </Button>
        {:else}
          <Button onclick={handleSubmit}>Submit Resume</Button>
        {/if}
      </div>
    {/if}
  </div>
</div>
