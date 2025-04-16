<script lang="ts">
    import {
        getCandidateEducation,
        unverifyEducation,
        verifyEducation,
    } from "$lib/services/candidates";
    import {
        ChevronDown,
        ChevronRight,
        Paperclip,
        CheckCircle,
        Shield,
        Loader,
        Users,
        Info,
        X, // Added X icon for unverify
    } from "lucide-svelte";
    import { userStore } from "$lib/stores/userStore";
    import type { EducationView } from "$lib/types/candidates";
    import { onMount } from "svelte";

    let { candidateId } = $props<{ candidateId: string }>();
    let isExpanded = $state(true);
    let education = $state<EducationView[]>([]);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);

    let currentEducId = $state<string>("");
    let modalOpen = $state(false);

    let verificationModal = $state(false);
    let educationToVerify = $state<EducationView | null>(null);
    let verificationLoading = $state(false);
    let verificationError = $state<string | null>(null);
    let isUnverifying = $state(false);

    let visibleVerifiers = $state<Record<string, boolean>>({});

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidatesEducation(id: string) {
        isLoading = true;
        fetchError = null;

        try {
            const response = await getCandidateEducation(id);
            education = response;
        } catch (err) {
            fetchError =
                err instanceof Error
                    ? err.message
                    : "Failed to load candidates education";
            console.error("Error fetching candidates education:", err);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (candidateId) {
            loadCandidatesEducation(candidateId);
        } else {
            console.error("Candidate ID is missing.");
            fetchError = "Candidate ID is required.";
            isLoading = false;
            education = [];
        }
    });

    function openDocumentCarousel(EdId: string) {
        currentEducId = EdId;
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }

    function getCurrentEducation(): EducationView | null {
        if (education.length > 0) {
            return education.find((ed) => ed.id === currentEducId) || null;
        }
        return null;
    }

    function isVerifiedByCurrentUser(educ: EducationView): boolean {
        if (!educ.verifications || educ.verifications.length === 0) {
            return false;
        }

        const currentUserId = $userStore?.recruiter_id;
        if (!currentUserId) {
            return false;
        }
        return educ.verifications.some(
            (ver) => ver.recruiter_id === currentUserId,
        );
    }

    function openVerificationModal(educ: EducationView, unverify = false) {
        educationToVerify = educ;
        isUnverifying = unverify;
        verificationError = "";
        verificationModal = true;
    }

    function closeVerificationModal() {
        verificationModal = false;
        educationToVerify = null;
        isUnverifying = false;
    }

    async function hanndleVerifyEducation() {
        if (!educationToVerify) return;

        const eduIdToVerify = educationToVerify.id;

        try {
            verificationLoading = true;
            verificationError = "";

            if (isUnverifying) {
                await unverifyEducation(candidateId, eduIdToVerify);
            } else {
                await verifyEducation(candidateId, eduIdToVerify);
            }

            await loadCandidatesEducation(candidateId);
            closeVerificationModal();
        } catch (err) {
            verificationError =
                err instanceof Error
                    ? err.message
                    : "Failed to verify education";
            console.error("Error verifying education:", err);
        } finally {
            verificationLoading = false;
        }
    }

    function toggleVerifiers(educId: string) {
        visibleVerifiers[educId] = !visibleVerifiers[educId];
    }

    function formatVerificationDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (e) {
            return "Invalid date";
        }
    }
</script>

<!-- <div class="mt-6 relative">
    <button
        type="button"
        class="flex items-center mb-4 w-full text-left"
        onclick={toggleExpanded}
        onkeydown={(e) => e.key === "Enter" && toggleExpanded()}
        aria-expanded={isExpanded}
    >
        <div class="rounded-full bg-red-600 py-2 px-4 flex items-center z-10">
            {#if isExpanded}
                <ChevronDown class="h-4 w-4 text-white mr-2" />
            {:else}
                <ChevronRight class="h-4 w-4 text-white mr-2" />
            {/if}
            <h2 class="text-xl font-bold text-white">Education</h2>
        </div>
    </button>

    {#if isExpanded}
    <div class="flow-root ml-3">
        {#if isLoading}
        <div class="flex justify-center items-center py-10 text-gray">
            <Loader class="h-6 w-6 mr-2 animate-spin" /> Loading Education...
        </div>
        {:else if fetchError}
        <div
        class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
    >
        Error loading data: {fetchError}
    </div>
    {:else if education && education.length >0}
        <ul class="divide-y divide-gray-200">
            {#each education as educ (educ.id)}
                {@const userVerified = isVerifiedByCurrentUser(educ)}
                <li class="relative border-l border-gray-200 py-4 pl-8">
                    <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600"></span>

                    <div class="space-y-1">
                        <div class="flex justify-between items-center">
                            I am here 
                        </div>
                    </div>
                        
                </li>
        </ul>
    
</div> -->
