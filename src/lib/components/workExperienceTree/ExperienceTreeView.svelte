<script lang="ts">
    import {
        ChevronDown,
        ChevronRight,
        Paperclip,
        CheckCircle,
        // XCircle, // Keep if needed for other UI parts, or remove if only used for 'Not Verified' text
        Shield,
        Loader,
        Users, // Icon for multiple users
        Info, // Icon for tooltip/dropdown trigger
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import type {
        WorkExperienceView,
        VerifyWorkExperienceResponse,
        VerificationDetailResponse, // Import the detail response type
        // Attachments, // Import if needed directly
    } from "$lib/types/candidates";
    import {
        getCandidateWorkExperience,
        verifyWorkExperience,
    } from "$lib/services/candidates";
    import Carousel from "$lib/components/carousel/Carousel.svelte";
    // import Tooltip from "$lib/components/Tooltip.svelte"; // Assuming you have a Tooltip component

    // Props
    let { candidateId } = $props<string>();

    // Component State
    let isExpanded = $state(true);
    let work_exp = $state<WorkExperienceView[] | undefined>(undefined); // Initial state undefined
    let isLoading = $state(true); // Add loading state for initial fetch
    let fetchError = $state<string | null>(null);

    // Modal State
    let currentExpId = $state("");
    let modalOpen = $state(false);

    // Verification Modal State
    let verificationModal = $state(false);
    let experienceToVerify = $state<WorkExperienceView | null>(null);
    // let verificationNote = $state(""); // Removed, not used in API call
    let verificationLoading = $state(false);
    let verificationError = $state("");

    // State to manage visibility of verifier lists (using experience ID as key)
    let visibleVerifiers = $state<Record<string, boolean>>({});

    // --- Functions ---

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidatesWorkExperience(id: string) {
        isLoading = true;
        fetchError = null;
        try {
            const data = await getCandidateWorkExperience(id);
            // Sort experiences (optional, e.g., by start date) before assigning
            work_exp = data; // Assign fetched data
        } catch (error) {
            console.error("Failed to load work experience:", error);
            fetchError =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while fetching work experience.";
            work_exp = []; // Set to empty array on error to avoid {#each} issues
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (candidateId) {
            loadCandidatesWorkExperience(candidateId);
        } else {
            console.error("Candidate ID is missing.");
            fetchError = "Candidate ID is required.";
            isLoading = false;
            work_exp = [];
        }
    });

    function openDocumentCarousel(expId: string) {
        currentExpId = expId;
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }

    function getCurrentExperience(): WorkExperienceView | null {
        if (!work_exp) return null;
        return work_exp.find((exp) => exp.id === currentExpId) ?? null;
    }

    function openVerificationModal(experience: WorkExperienceView) {
        experienceToVerify = experience;
        verificationError = "";
        verificationModal = true;
    }

    function closeVerificationModal() {
        verificationModal = false;
        experienceToVerify = null; // Clear selection
    }

    // Updated verification handler - Re-fetches data on success
    async function handleVerifyExperience() {
        if (!experienceToVerify) return;

        const expIdToVerify = experienceToVerify.id; // Store ID before clearing state

        try {
            verificationLoading = true;
            verificationError = "";

            // Call the updated API endpoint
            const response = await verifyWorkExperience(
                candidateId,
                expIdToVerify,
            );

            console.log("Verification successful:", response.message); // Log success

            // --- Re-fetch the work experience data to update the UI accurately ---
            await loadCandidatesWorkExperience(candidateId); // Reload data

            // Close modal
            closeVerificationModal();
        } catch (error) {
            console.error("Failed to verify experience:", error);
            verificationError =
                error instanceof Error
                    ? error.message
                    : "An error occurred while verifying the experience.";
            // Keep the modal open to show the error
        } finally {
            verificationLoading = false;
            // experienceToVerify = null; // Don't clear here if we keep modal open on error
        }
    }

    // Toggle visibility of the verifier list for a specific experience
    function toggleVerifiers(expId: string) {
        visibleVerifiers[expId] = !visibleVerifiers[expId];
    }

    // Helper to format date string
    function formatVerificationDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            // Example format: Mar 28, 2025, 10:30 AM
            return date.toLocaleString(undefined, {
                // Use user's locale
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true, // Use AM/PM
            });
        } catch (e) {
            return "Invalid date"; // Fallback for parsing errors
        }
    }
</script>

<div class="mt-6 relative">
    <button
        type="button"
        class="flex items-center mb-4 w-full text-left"
        onclick={toggleExpanded}
        aria-expanded={isExpanded}
    >
        <div class="rounded-full bg-red-600 py-2 px-4 flex items-center z-10">
            {#if isExpanded}
                <ChevronDown class="h-4 w-4 text-white mr-2" />
            {:else}
                <ChevronRight class="h-4 w-4 text-white mr-2" />
            {/if}
            <h2 class="text-xl font-bold text-white">Work Experience</h2>
        </div>
    </button>

    {#if isExpanded}
        <div class="flow-root ml-3">
            {#if isLoading}
                <div
                    class="flex justify-center items-center py-10 text-gray-500"
                >
                    <Loader class="h-6 w-6 mr-2 animate-spin" /> Loading Experience...
                </div>
            {:else if fetchError}
                <div
                    class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
                >
                    Error loading data: {fetchError}
                </div>
            {:else if work_exp && work_exp.length > 0}
                <ul class="divide-y divide-gray-200">
                    {#each work_exp as workExp (workExp.id)}
                        <li class="relative border-l border-gray-200 py-4 pl-8">
                            <span
                                class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600"
                            ></span>

                            <div class="space-y-1">
                                <div class="flex justify-between">
                                    <div>
                                        <p class="text-lg font-semibold">
                                            {workExp.company}
                                        </p>
                                        <p class="text-base text-gray-500">
                                            {workExp.location}
                                        </p>
                                        <p class="text-base text-gray-500">
                                            {workExp.title}
                                        </p>
                                    </div>
                                    <div
                                        class="flex flex-col items-end space-y-1"
                                    >
                                        <p
                                            class="text-sm text-gray-500 whitespace-nowrap"
                                        >
                                            {workExp.start_date} - {workExp.end_date ??
                                                "Present"}
                                        </p>

                                        {#if workExp.verifications && workExp.verifications.length > 0}
                                            {@const count =
                                                workExp.verifications.length}
                                            <div
                                                class="flex items-center text-green-600 text-xs font-medium relative"
                                            >
                                                <CheckCircle
                                                    class="h-4 w-4 mr-1 flex-shrink-0"
                                                />
                                                <span>Verified</span>
                                                {#if count === 1}
                                                    <span
                                                        class="text-gray-500 ml-1"
                                                    >
                                                        by {workExp
                                                            .verifications[0]
                                                            .recruiter_name ??
                                                            "Unknown"}
                                                    </span>
                                                {:else if count > 1}
                                                    <button
                                                        type="button"
                                                        class="flex items-center text-gray-500 ml-1 hover:text-blue-600 transition-colors"
                                                        onclick={() =>
                                                            toggleVerifiers(
                                                                workExp.id,
                                                            )}
                                                        aria-label="Show verifiers"
                                                    >
                                                        by {count} recruiters
                                                        <Info
                                                            class="h-3 w-3 ml-1"
                                                        />
                                                    </button>
                                                    {#if visibleVerifiers[workExp.id]}
                                                        <div
                                                            class="absolute top-full right-0 mt-1 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2 text-xs"
                                                        >
                                                            <p
                                                                class="font-semibold mb-1 border-b pb-1"
                                                            >
                                                                Verified By:
                                                            </p>
                                                            <ul
                                                                class="space-y-1 max-h-40 overflow-y-auto"
                                                            >
                                                                {#each workExp.verifications as verification}
                                                                    <li>
                                                                        <span
                                                                            class="font-medium"
                                                                            >{verification.recruiter_name ??
                                                                                "Unknown"}</span
                                                                        >
                                                                        <span
                                                                            class="text-gray-500 block text-[11px]"
                                                                        >
                                                                            {formatVerificationDate(
                                                                                verification.verified_at,
                                                                            )}
                                                                        </span>
                                                                    </li>
                                                                {/each}
                                                            </ul>
                                                        </div>
                                                    {/if}
                                                {/if}
                                            </div>
                                        {:else}
                                            <div
                                                class="flex items-center text-gray-500 text-xs font-medium"
                                            >
                                                <span class="text-red-500"
                                                    >Not verified</span
                                                >
                                            </div>
                                        {/if}

                                        <button
                                            type="button"
                                            class="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors mt-1"
                                            onclick={() =>
                                                openVerificationModal(workExp)}
                                            aria-label={`Verify experience at ${workExp.company}`}
                                        >
                                            <Shield class="h-3 w-3 mr-1" />
                                            Verify
                                        </button>
                                    </div>
                                </div>

                                {#if workExp.attachments && workExp.attachments.length > 0}
                                    <button
                                        type="button"
                                        class="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm"
                                        onclick={() =>
                                            openDocumentCarousel(workExp.id)}
                                    >
                                        <Paperclip class="h-4 w-4 mr-1" />
                                        View Documents ({workExp.attachments
                                            .length})
                                    </button>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <div class="text-center py-6 text-gray-500">
                    No work experience added for this candidate yet.
                </div>
            {/if}
        </div>
    {/if}
</div>

{#if modalOpen}
    {@const currentExp = getCurrentExperience()}
    {#if currentExp}
        <Carousel attachments={currentExp.attachments} onClose={closeModal} />
    {/if}
{/if}

{#if verificationModal && experienceToVerify}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">
                    Verify Work Experience
                </h3>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <p class="font-semibold text-gray-800">
                        {experienceToVerify.company}
                    </p>

                    <p class="text-sm text-gray-600">
                        {experienceToVerify.title}
                    </p>
                    <p class="text-sm text-gray-600">
                        {experienceToVerify.start_date} - {experienceToVerify.end_date ??
                            "Present"}
                    </p>
                </div>

                {#if verificationError}
                    <div
                        class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
                    >
                        {verificationError}
                    </div>
                {/if}

                <div class="flex justify-between items-center mt-6">
                    <div class="text-sm text-gray-500">
                        <p>Your verification will be recorded.</p>
                    </div>
                    <div class="flex gap-2">
                        <button
                            type="button"
                            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            onclick={closeVerificationModal}
                            disabled={verificationLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-75"
                            onclick={handleVerifyExperience}
                            disabled={verificationLoading}
                        >
                            {#if verificationLoading}
                                <Loader class="h-4 w-4 mr-2 animate-spin" /> Verifying...
                            {:else}
                                <CheckCircle class="h-4 w-4 mr-2" /> Verify Experience
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
