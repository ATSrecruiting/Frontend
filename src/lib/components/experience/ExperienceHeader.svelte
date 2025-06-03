<script lang="ts">
    import { ArrowLeft, CheckCircle, Shield } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import type { VerificationDetailResponse } from "$lib/types/candidates";



    let { candidateId, verifications } = $props<{
        candidateId: string;
        verifications: VerificationDetailResponse[];
    }>();

    function goBack() {
        goto(`/candidates/${candidateId}`);
    }
</script>

<!-- Header -->
<div class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <button
                    type="button"
                    class="flex items-center text-gray-600 hover:text-black transition-colors"
                    onclick={goBack}
                >
                    <ArrowLeft class="h-5 w-5 mr-2" />
                    Back to Candidate
                </button>
            </div>

            <div class="flex items-center space-x-3">
                {#if verifications.length > 0}
                    <div class="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle class="h-4 w-4 mr-1" />
                        Verified by {verifications.length} recruiter{verifications.length > 1 ? "s" : ""}
                    </div>
                {:else}
                    <div class="flex items-center text-red-500 text-sm font-medium">
                        Not verified
                    </div>
                {/if}

                <button
                    type="button"
                    class="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Shield class="h-4 w-4 mr-2" />
                    Verify Experience
                </button>
            </div>
        </div>
    </div>
</div>