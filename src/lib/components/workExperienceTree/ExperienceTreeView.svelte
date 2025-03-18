<script lang="ts">
    import { ChevronDown, ChevronRight, Paperclip } from "lucide-svelte";
    import { onMount } from "svelte";
    import type { WorkExperienceView } from "$lib/types/candidates";
    import { getCandidateWorkExperience } from "$lib/services/candidates";
    import Carousel from "$lib/components/carousel/Carousel.svelte";

    let { candidateId } = $props<string>();

    // Using $state for reactive variables
    let isExpanded = $state(true); // State to track if work experience section is expanded
    let currentExpIndex = $state(-1); // Track which experience has open modal
    let modalOpen = $state(false);

    let work_exp = $state<WorkExperienceView[]>();

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidatesWorkExperience(candidateId: string) {
        try {
            const data = await getCandidateWorkExperience(candidateId);
            if (data) {
                work_exp = data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Set loading state to false
        }
    }

    onMount(() => {
        loadCandidatesWorkExperience(candidateId);
    });

    function openDocumentCarousel(expIndex: number) {
        currentExpIndex = expIndex;
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }
</script>

<div class="mt-6 relative">
    <!-- Work Experience Bubble at the start of the tree -->
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
            <h2 class="text-xl font-bold text-white">Work Experience</h2>
        </div>
    </button>

    {#if isExpanded}
        <div class="flow-root ml-3">
            <ul class="divide-y divide-gray-200">
                {#each work_exp || [] as workExp, index}
                    <li class="relative border-l border-gray-200 py-4 pl-8">
                        <span
                            class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600"
                        ></span>

                        <!-- Display mode only -->
                        <div class="space-y-1">
                            <div class="flex justify-between items-center">
                                <p class="text-lg font-semibold">
                                    {workExp.company}
                                </p>
                                <div class="flex items-center">
                                    <p class="text-sm text-gray-500">
                                        {workExp.start_date} - {workExp.end_date ??
                                            "Present"}
                                    </p>
                                </div>
                            </div>
                            <p class="text-base text-gray-500">
                                {workExp.location}
                            </p>
                            <p class="text-base text-gray-500">
                                {workExp.title}
                            </p>

                            <!-- Document button -->
                            {#if workExp.attachments && workExp.attachments.length > 0}
                                <button
                                    type="button"
                                    class="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm"
                                    onclick={() => openDocumentCarousel(index)}
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
        </div>
    {/if}
</div>

<!-- Attachment Viewer Modal -->
{#if modalOpen && work_exp && currentExpIndex >= 0}
    <Carousel
        attachments={work_exp[currentExpIndex].attachments}
        onClose={closeModal}
    />
{/if}
