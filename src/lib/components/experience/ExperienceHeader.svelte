<script lang="ts">
  import { ArrowLeft, CheckCircle, Shield } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import type { VerificationDetailResponse } from "$lib/types/candidates";

  let { candidateId, verifications } = $props<{
    candidateId: string;
    verifications: VerificationDetailResponse[];
  }>();

  function goBack() {
    goto(`/dashboard/candidates/${candidateId}`);
  }
</script>

<!-- Header -->
<div class="bg-background border-b border-border sticky top-0 z-10">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <button
          type="button"
          class="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          onclick={goBack}
        >
          <ArrowLeft class="h-5 w-5 mr-2" />
          Back to Candidate
        </button>
      </div>

      <div class="flex items-center space-x-3">
        {#if verifications.length > 0}
          <div
            class="flex items-center text-green-600 dark:text-green-400 text-sm font-medium"
          >
            <CheckCircle class="h-4 w-4 mr-1" />
            Verified by {verifications.length} recruiter{verifications.length >
            1
              ? "s"
              : ""}
          </div>
        {:else}
          <div class="flex items-center text-destructive text-sm font-medium">
            Not verified
          </div>
        {/if}

        <button
          type="button"
          class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          <Shield class="h-4 w-4 mr-2" />
          Verify Experience
        </button>
      </div>
    </div>
  </div>
</div>
