<script lang="ts">
    import {
        ChevronDown,
        Paperclip,
        CheckCircle,
        Shield,
        Loader,
        Users,
        Info,
        X, // Added X icon for unverify
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import type {
        WorkExperienceView,
        VerifyWorkExperienceResponse,
        VerificationDetailResponse,
    } from "$lib/types/candidates";
    import {
        listCandidateWorkExperience,
        verifyWorkExperience,
        unverifyWorkExperience,
    } from "$lib/services/candidates";
    import Carousel from "$lib/components/carousel/Carousel.svelte";
    import { userStore } from "$lib/stores/userStore";
    import { goto } from "$app/navigation";

    // Props
    let { candidateId } = $props<string>();

    // Component State
    let isExpanded = $state(true);
    let work_exp = $state<WorkExperienceView[] | undefined>(undefined);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);

    // Modal State
    let currentExpId = $state("");
    let modalOpen = $state(false);

    // Verification Modal State
    let verificationModal = $state(false);
    let experienceToVerify = $state<WorkExperienceView | null>(null);
    let verificationLoading = $state(false);
    let verificationError = $state("");
    let isUnverifying = $state(false); // New state to track if we're verifying or unverifying

    let visibleVerifiers = $state<Record<string, boolean>>({});

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidatesWorkExperience(id: string) {
        isLoading = true;
        fetchError = null;
        try {
            const data = await listCandidateWorkExperience(id);
            work_exp = data;
        } catch (error) {
            console.error("Failed to load work experience:", error);
            fetchError =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while fetching work experience.";
            work_exp = [];
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

    // Check if the current user has already verified this experience
    function isVerifiedByCurrentUser(workExp: WorkExperienceView): boolean {
        if (!workExp.verifications || workExp.verifications.length === 0)
            return false;

        // Get current user ID from userStore
        const currentUserId = $userStore?.recruiter_id;
        if (!currentUserId) return false;

        // Check if current user ID exists in the verifications
        return workExp.verifications.some(
            (v) => v.recruiter_id === currentUserId,
        );
    }

    function openVerificationModal(
        experience: WorkExperienceView,
        unverify = false,
    ) {
        experienceToVerify = experience;
        isUnverifying = unverify;
        verificationError = "";
        verificationModal = true;
    }

    function closeVerificationModal() {
        verificationModal = false;
        experienceToVerify = null;
        isUnverifying = false;
    }

    async function handleVerifyExperience() {
        if (!experienceToVerify) return;

        const expIdToVerify = experienceToVerify.id;

        try {
            verificationLoading = true;
            verificationError = "";

            if (isUnverifying) {
                // Placeholder for unverify functionality
                console.log("Unverify experience ID:", expIdToVerify);
                const response = await unverifyWorkExperience(
                    candidateId,
                    expIdToVerify,
                );
                // For now, just refresh the data to simulate the change
            } else {
                // Regular verify flow
                const response = await verifyWorkExperience(
                    candidateId,
                    expIdToVerify,
                );
                console.log("Verification successful:", response.message);
            }

            // Re-fetch the work experience data to update the UI
            await loadCandidatesWorkExperience(candidateId);

            // Close modal
            closeVerificationModal();
        } catch (error) {
            console.error(
                `Failed to ${isUnverifying ? "unverify" : "verify"} experience:`,
                error,
            );
            verificationError =
                error instanceof Error
                    ? error.message
                    : `An error occurred while ${isUnverifying ? "unverifying" : "verifying"} the experience.`;
        } finally {
            verificationLoading = false;
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

    // Add this function to handle navigation
    function navigateToExperienceDetails(workExp: WorkExperienceView) {
        // Navigate to the experience details page
        goto(`/dashboard/candidates/${candidateId}/work_experience/${workExp.id}`);
    }
</script>

<div class="mt-6 relative">
    <!-- Updated header with black and white design -->
    <button
        type="button"
        class="flex items-center mb-4 w-full text-left group focus:outline-none"
        onclick={toggleExpanded}
        aria-expanded={isExpanded}
    >
        <div
            class="w-full flex items-center justify-between border-b-2 border-black pb-2 transition-all duration-200"
        >
            <div class="flex items-center">
                <h2 class="text-xl font-bold text-black mr-2">
                    Work Experience
                </h2>
            </div>
            <div
                class="transform transition-transform duration-200 {isExpanded
                    ? 'rotate-180'
                    : ''}"
            >
                <ChevronDown class="h-5 w-5 text-black" />
            </div>
        </div>
    </button>

    {#if isExpanded}
        <div class="flow-root">
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
                <ul class="divide-y divide-gray-100">
                    {#each work_exp as workExp (workExp.id)}
                        {@const userVerified = isVerifiedByCurrentUser(workExp)}
                        <li
                            class="relative border-l-2 border-gray-200 hover:border-black transition-colors duration-200"
                        >
                            <div
                                role="button"
                                tabindex="0"
                                class="w-full text-left py-4 pl-6 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
                                onclick={(e) => {
                                    // Only navigate if clicking on the main content, not nested buttons
                                    const target = e.target as HTMLElement;
                                    if (
                                        target.closest('[role="button"]') !==
                                        e.currentTarget
                                    ) {
                                        return;
                                    }
                                    navigateToExperienceDetails(workExp);
                                }}
                                onkeypress={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        navigateToExperienceDetails(workExp);
                                    }
                                }}
                                aria-label={`View details for ${workExp.title} at ${workExp.company}`}
                            >
                                <span
                                    class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black group-hover:bg-gray-700 transition-colors"
                                ></span>

                                <div
                                    class="space-y-1 group-hover:bg-gray-50 -m-2 p-2 rounded-md transition-colors"
                                >
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <div class="flex-1 min-w-0">
                                            <p
                                                class="text-lg font-semibold group-hover:text-gray-900 transition-colors"
                                            >
                                                {workExp.company}
                                            </p>
                                            <p
                                                class="text-base text-gray-700 group-hover:text-gray-800 transition-colors"
                                            >
                                                {workExp.location}
                                            </p>
                                            <p
                                                class="text-base text-gray-700 group-hover:text-gray-800 transition-colors"
                                            >
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
                                                    workExp.verifications
                                                        .length}
                                                <div
                                                    class="flex items-center text-green-600 text-xs font-medium relative"
                                                >
                                                    <CheckCircle
                                                        class="h-4 w-4 mr-1 shrink-0"
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
                                                            class="flex items-center text-gray-500 ml-1 hover:text-black transition-colors"
                                                            onclick={(e) => {
                                                                e.stopPropagation();
                                                                toggleVerifiers(
                                                                    workExp.id,
                                                                );
                                                            }}
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
                                                                            >
                                                                                {verification.recruiter_name ??
                                                                                    "Unknown"}
                                                                            </span>
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

                                            <!-- Conditional button: Verify or Unverify -->
                                            {#if userVerified}
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-800 transition-colors mt-1"
                                                    onclick={(e) => {
                                                        e.stopPropagation();
                                                        openVerificationModal(
                                                            workExp,
                                                            true,
                                                        );
                                                    }}
                                                    aria-label={`Unverify experience at ${workExp.company}`}
                                                >
                                                    <X class="h-3 w-3 mr-1" />
                                                    Unverify
                                                </button>
                                            {:else}
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center text-xs font-medium text-gray-600 hover:text-black transition-colors mt-1"
                                                    onclick={(e) => {
                                                        e.stopPropagation();
                                                        openVerificationModal(
                                                            workExp,
                                                            false,
                                                        );
                                                    }}
                                                    aria-label={`Verify experience at ${workExp.company}`}
                                                >
                                                    <Shield
                                                        class="h-3 w-3 mr-1"
                                                    />
                                                    Verify
                                                </button>
                                            {/if}
                                        </div>
                                    </div>

                                    {#if workExp.attachments && workExp.attachments.length > 0}
                                        <button
                                            type="button"
                                            class="mt-2 inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                            onclick={(e) => {
                                                e.stopPropagation();
                                                openDocumentCarousel(
                                                    workExp.id,
                                                );
                                            }}
                                        >
                                            <Paperclip class="h-4 w-4 mr-1" />
                                            View Documents ({workExp.attachments
                                                .length})
                                        </button>
                                    {/if}
                                </div>
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
        <Carousel
            attachment_ids={currentExp.attachments}
            onClose={closeModal}
        />
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
                    {isUnverifying ? "Unverify" : "Verify"} Work Experience
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
                        <p>
                            {#if isUnverifying}
                                Your verification will be removed.
                            {:else}
                                Your verification will be recorded.
                            {/if}
                        </p>
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
                            class={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                isUnverifying
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-black hover:bg-gray-800"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center disabled:opacity-75`}
                            onclick={handleVerifyExperience}
                            disabled={verificationLoading}
                        >
                            {#if verificationLoading}
                                <Loader class="h-4 w-4 mr-2 animate-spin" />
                                {isUnverifying
                                    ? "Unverifying..."
                                    : "Verifying..."}
                            {:else if isUnverifying}
                                <X class="h-4 w-4 mr-2" /> Unverify Experience
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
