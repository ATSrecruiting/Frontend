<script lang="ts">
  import { getCandidateWhoAmI } from "$lib/services/candidates";

    import {
        ChevronDown,
        Paperclip,
        Loader,
    } from "lucide-svelte";
    import { userStore } from "$lib/stores/userStore";
    import Carousel from "$lib/components/carousel/Carousel.svelte";
    import { onMount } from "svelte";
    import type { WhoAmIView } from "$lib/types/candidates";

    let { candidateId } = $props<{ candidateId: string }>();
    let isExpanded = $state(true);
    let whoAmI = $state<WhoAmIView | null>(null);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);

    let modalOpen = $state(false);

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidateWhoAmI(id: string) {
        isLoading = true;
        fetchError = null;

        try {
            const response = await getCandidateWhoAmI(id);
            whoAmI = response;
        } catch (err) {
            fetchError =
                err instanceof Error
                    ? err.message
                    : "Failed to load Who Am I data";
            console.error("Error fetching Who Am I:", err);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (candidateId) {
            loadCandidateWhoAmI(candidateId);
        } else {
            console.error("Candidate ID is missing.");
            fetchError = "Candidate ID is required.";
            isLoading = false;
            whoAmI = null;
        }
    });

    function openDocumentCarousel() {
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }
</script>

<div class="mt-6 relative">
    <!-- Header/dropdown button -->
    <button
        type="button"
        class="flex items-center mb-4 w-full text-left group focus:outline-none"
        onclick={toggleExpanded}
        onkeydown={(e) => e.key === "Enter" && toggleExpanded()}
        aria-expanded={isExpanded}
    >
        <div
            class="w-full flex items-center justify-between border-b-2 border-black pb-2 transition-all duration-200"
        >
            <div class="flex items-center">
                <h2 class="text-xl font-bold text-black mr-2">
                    Who I Am
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
                    <Loader class="h-6 w-6 mr-2 animate-spin" /> Loading Who Am I...
                </div>
            {:else if fetchError}
                <div
                    class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
                >
                    Error loading data: {fetchError}
                </div>
            {:else if whoAmI}
                <ul class="divide-y divide-gray-100">
                    <!-- Personal Statement -->
                    {#if whoAmI.personal_statement}
                        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
                            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <p class="text-lg font-semibold">Personal Statement</p>
                                </div>
                                <p class="text-base text-gray-700">
                                    {whoAmI.personal_statement}
                                </p>
                            </div>
                        </li>
                    {/if}

                    <!-- Core Values -->
                    {#if whoAmI.core_values && whoAmI.core_values.length > 0}
                        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
                            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <p class="text-lg font-semibold">Core Values</p>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each whoAmI.core_values as value}
                                        <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                            {value}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </li>
                    {/if}

                    <!-- Working Style -->
                    {#if whoAmI.working_style && whoAmI.working_style.length > 0}
                        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
                            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <p class="text-lg font-semibold">Working Style</p>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each whoAmI.working_style as style}
                                        <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                            {style}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </li>
                    {/if}

                    <!-- Motivators -->
                    {#if whoAmI.motivators && whoAmI.motivators.length > 0}
                        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
                            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <p class="text-lg font-semibold">Motivators</p>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each whoAmI.motivators as motivator}
                                        <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                            {motivator}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </li>
                    {/if}

                    <!-- Interests/Passions -->
                    {#if whoAmI.interests_passions && whoAmI.interests_passions.length > 0}
                        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
                            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <p class="text-lg font-semibold">Interests/Passions</p>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    {#each whoAmI.interests_passions as interest}
                                        <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                            {interest}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </li>
                    {/if}

                    <!-- Documents Section -->
                    {#if whoAmI.attachments && whoAmI.attachments.length > 0}
                        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
                            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <p class="text-lg font-semibold">Documents</p>
                                </div>
                                <button
                                    type="button"
                                    class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                    onclick={openDocumentCarousel}
                                >
                                    <Paperclip class="h-4 w-4 mr-1" />
                                    View Documents ({whoAmI.attachments.length})
                                </button>
                            </div>
                        </li>
                    {/if}
                </ul>
            {:else}
                <div class="text-center py-6 text-gray-500">
                    No "Who Am I" information added for this candidate yet.
                </div>
            {/if}
        </div>
    {/if}
</div>

{#if modalOpen && whoAmI?.attachments}
    <Carousel attachment_ids={whoAmI.attachments} onClose={closeModal} />
{/if}