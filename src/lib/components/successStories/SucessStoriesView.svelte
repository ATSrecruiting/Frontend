<script lang="ts">
    import {
        getCandidateSuccessStories,
        unverifySuccessStory,
        verifySuccessStory,
    } from "$lib/services/candidates";
    import {
        ChevronDown,
        Paperclip,
        CheckCircle,
        Shield,
        Loader,
        Info,
        X,
    } from "lucide-svelte";
    import { userStore } from "$lib/stores/userStore";
    import Carousel from "$lib/components/carousel/Carousel.svelte";
    import { onMount } from "svelte";
    import type { SuccessStoryView } from "$lib/types/candidates";

    let { candidateId } = $props<{ candidateId: string }>();
    let isExpanded = $state(true);
    let successStories = $state<SuccessStoryView[]>([]);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);

    let currentStoryId = $state<string>("");
    let modalOpen = $state(false);
    let verificationModal = $state(false);
    let storyToVerify = $state<SuccessStoryView | null>(null);
    let verificationLoading = $state(false);
    let verificationError = $state<string | null>(null);

    let isUnverifying = $state(false);

    let visibleVerifiers = $state<Record<string, boolean>>({});

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidateSuccessStories(id: string) {
        isLoading = true;
        fetchError = null;

        try {
            const response = await getCandidateSuccessStories(id);
            successStories = response;
        } catch (err) {
            fetchError =
                err instanceof Error
                    ? err.message
                    : "Failed to load success stories data";
            console.error("Error fetching success stories:", err);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (candidateId) {
            loadCandidateSuccessStories(candidateId);
        } else {
            console.error("Candidate ID is missing.");
            fetchError = "Candidate ID is required.";
            isLoading = false;
            successStories = [];
        }
    });

    function openDocumentCarousel(storyId: string) {
        currentStoryId = storyId;
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }

    function getCurrentSuccessStory(): SuccessStoryView | null {
        if (successStories.length > 0) {
            return (
                successStories.find((story) => story.id === currentStoryId) ||
                null
            );
        }
        return null;
    }

    function isVerifiedByCurrentUser(story: SuccessStoryView): boolean {
        if (!story.verifications || story.verifications.length === 0) {
            return false;
        }

        const currentUserId = $userStore?.recruiter_id;
        if (!currentUserId) {
            return false;
        }
        return story.verifications.some(
            (ver) => ver.recruiter_id === currentUserId,
        );
    }

    function openVerificationModal(story: SuccessStoryView, unverify = false) {
        storyToVerify = story;
        isUnverifying = unverify;
        verificationError = null;
        verificationModal = true;
    }

    function closeVerificationModal() {
        verificationModal = false;
        storyToVerify = null;
        isUnverifying = false;
        verificationError = null;
    }

    async function handleVerifySuccessStory() {
        if (!storyToVerify) return;

        const storyIdToVerify = storyToVerify.id;

        try {
            verificationLoading = true;
            verificationError = null;

            if (isUnverifying) {
                await unverifySuccessStory(candidateId, storyIdToVerify);
            } else {
                await verifySuccessStory(candidateId, storyIdToVerify);
            }

            await loadCandidateSuccessStories(candidateId);
            closeVerificationModal();
        } catch (err) {
            verificationError =
                err instanceof Error
                    ? err.message
                    : "Failed to verify success story";
            console.error("Error verifying success story:", err);
        } finally {
            verificationLoading = false;
        }
    }

    function toggleVerifiers(storyId: string) {
        visibleVerifiers[storyId] = !visibleVerifiers[storyId];
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
            class="w-full flex items-center justify-between border-b-2 border-foreground pb-2 transition-all duration-200"
        >
            <div class="flex items-center">
                <h2 class="text-xl font-bold text-foreground mr-2">
                    Success Stories
                </h2>
            </div>
            <div
                class="transform transition-transform duration-200 {isExpanded
                    ? 'rotate-180'
                    : ''}"
            >
                <ChevronDown class="h-5 w-5 text-foreground" />
            </div>
        </div>
    </button>

    {#if isExpanded}
        <div class="flow-root">
            {#if isLoading}
                <div
                    class="flex justify-center items-center py-10 text-muted-foreground"
                >
                    <Loader class="h-6 w-6 mr-2 animate-spin" /> Loading Success
                    Stories...
                </div>
            {:else if fetchError}
                <div
                    class="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm"
                >
                    Error loading data: {fetchError}
                </div>
            {:else if successStories && successStories.length > 0}
                <ul class="divide-y divide-border">
                    {#each successStories as story (story.id)}
                        {@const userVerified = isVerifiedByCurrentUser(story)}
                        <li
                            class="relative border-l-2 border-border py-4 pl-6 hover:border-foreground transition-colors duration-200"
                        >
                            <!-- Dot -->
                            <span
                                class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-foreground"
                            ></span>

                            <div class="space-y-3">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h3
                                            class="text-lg font-semibold mb-1 text-foreground"
                                        >
                                            {story.headline}
                                        </h3>
                                        {#if story.timeframe}
                                            <p
                                                class="text-sm text-muted-foreground mb-2"
                                            >
                                                {story.timeframe}
                                            </p>
                                        {/if}
                                    </div>
                                    <div
                                        class="flex flex-col items-end space-y-1"
                                    >
                                        {#if story.verifications && story.verifications.length > 0}
                                            {@const count =
                                                story.verifications.length}
                                            <div
                                                class="flex items-center text-green-600 dark:text-green-400 text-xs font-medium relative"
                                            >
                                                <CheckCircle
                                                    class="h-4 w-4 mr-1 shrink-0"
                                                />
                                                <span>Verified</span>
                                                {#if count === 1}
                                                    <span
                                                        class="text-muted-foreground ml-1"
                                                    >
                                                        by {story
                                                            .verifications[0]
                                                            .recruiter_name ??
                                                            "Unknown"}
                                                    </span>
                                                {:else if count > 1}
                                                    <button
                                                        type="button"
                                                        class="flex items-center text-muted-foreground ml-1 hover:text-foreground transition-colors"
                                                        onclick={() =>
                                                            toggleVerifiers(
                                                                story.id,
                                                            )}
                                                        aria-label="Show verifiers"
                                                    >
                                                        by {count} recruiters
                                                        <Info
                                                            class="h-3 w-3 ml-1"
                                                        />
                                                    </button>
                                                    {#if visibleVerifiers[story.id]}
                                                        <div
                                                            class="absolute top-full right-0 mt-1 w-60 bg-popover border border-border rounded-md shadow-lg z-10 p-2 text-xs"
                                                        >
                                                            <p
                                                                class="font-semibold mb-1 border-b border-border pb-1 text-popover-foreground"
                                                            >
                                                                Verified By:
                                                            </p>
                                                            <ul
                                                                class="space-y-1 max-h-40 overflow-y-auto"
                                                            >
                                                                {#each story.verifications as verification}
                                                                    <li>
                                                                        <span
                                                                            class="font-medium text-popover-foreground"
                                                                        >
                                                                            {verification.recruiter_name ??
                                                                                "Unknown"}
                                                                        </span>
                                                                        <span
                                                                            class="text-muted-foreground block text-[11px]"
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
                                                class="flex items-center text-muted-foreground text-xs font-medium"
                                            >
                                                <span class="text-destructive"
                                                    >Not verified</span
                                                >
                                            </div>
                                        {/if}

                                        <!-- Conditional button: Verify or Unverify -->
                                        {#if userVerified}
                                            <button
                                                type="button"
                                                class="inline-flex items-center text-xs font-medium text-destructive hover:text-destructive/80 transition-colors mt-1"
                                                onclick={() =>
                                                    openVerificationModal(
                                                        story,
                                                        true,
                                                    )}
                                                aria-label={`Unverify success story ${story.headline}`}
                                            >
                                                <X class="h-3 w-3 mr-1" />
                                                Unverify
                                            </button>
                                        {:else}
                                            <button
                                                type="button"
                                                class="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mt-1"
                                                onclick={() =>
                                                    openVerificationModal(
                                                        story,
                                                        false,
                                                    )}
                                                aria-label={`Verify success story ${story.headline}`}
                                            >
                                                <Shield class="h-3 w-3 mr-1" />
                                                Verify
                                            </button>
                                        {/if}
                                    </div>
                                </div>

                                <div>
                                    <h4
                                        class="text-sm font-medium text-muted-foreground mb-1"
                                    >
                                        Situation/Challenge:
                                    </h4>
                                    <p class="text-base text-muted-foreground">
                                        {story.situation}
                                    </p>
                                </div>

                                <div>
                                    <h4
                                        class="text-sm font-medium text-muted-foreground mb-1"
                                    >
                                        Actions Taken:
                                    </h4>
                                    <p class="text-base text-muted-foreground">
                                        {story.actions}
                                    </p>
                                </div>

                                <div>
                                    <h4
                                        class="text-sm font-medium text-muted-foreground mb-1"
                                    >
                                        Results/Impact:
                                    </h4>
                                    <p class="text-base text-muted-foreground">
                                        {story.results}
                                    </p>
                                </div>

                                <!-- Skills Demonstrated tags -->
                                {#if story.skills && story.skills.length > 0}
                                    <div>
                                        <h4
                                            class="text-sm font-medium text-muted-foreground mb-2"
                                        >
                                            Skills Demonstrated:
                                        </h4>
                                        <div class="flex flex-wrap gap-1">
                                            {#each story.skills as skill}
                                                <span
                                                    class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                                >
                                                    {skill}
                                                </span>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}

                                {#if story.relevant_experience}
                                    <div>
                                        <h4
                                            class="text-sm font-medium text-muted-foreground mb-1"
                                        >
                                            Relevant Experience:
                                        </h4>
                                        <p
                                            class="text-base text-muted-foreground"
                                        >
                                            {story.relevant_experience}
                                        </p>
                                    </div>
                                {/if}

                                {#if story.attachments && story.attachments.length > 0}
                                    <button
                                        type="button"
                                        class="mt-2 inline-flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors text-sm"
                                        onclick={() =>
                                            openDocumentCarousel(story.id)}
                                    >
                                        <Paperclip class="h-4 w-4 mr-1" />
                                        View Documents ({story.attachments
                                            .length})
                                    </button>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <div class="text-center py-6 text-muted-foreground">
                    No success stories added for this candidate yet.
                </div>
            {/if}
        </div>
    {/if}
</div>

{#if modalOpen}
    {@const currentStory = getCurrentSuccessStory()}
    {#if currentStory}
        <Carousel
            attachment_ids={currentStory.attachments}
            onClose={closeModal}
        />
    {/if}
{/if}

{#if verificationModal && storyToVerify}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
        <div
            class="bg-popover rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        >
            <div class="px-6 py-4 bg-muted border-b border-border">
                <h3 class="text-lg font-medium text-popover-foreground">
                    {isUnverifying ? "Unverify" : "Verify"} Success Story
                </h3>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <p class="font-semibold text-popover-foreground">
                        {storyToVerify.headline}
                    </p>
                    {#if storyToVerify.timeframe}
                        <p class="text-sm text-muted-foreground">
                            {storyToVerify.timeframe}
                        </p>
                    {/if}
                </div>

                {#if verificationError}
                    <div
                        class="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm"
                    >
                        {verificationError}
                    </div>
                {/if}

                <div class="flex justify-between items-center mt-6">
                    <div class="text-sm text-muted-foreground">
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
                            class="px-4 py-2 border border-border rounded-md text-sm font-medium text-popover-foreground bg-popover hover:bg-muted disabled:opacity-50"
                            onclick={closeVerificationModal}
                            disabled={verificationLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground ${
                                isUnverifying
                                    ? "bg-destructive hover:bg-destructive/90"
                                    : "bg-primary hover:bg-primary/90"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring flex items-center disabled:opacity-75`}
                            onclick={handleVerifySuccessStory}
                            disabled={verificationLoading}
                        >
                            {#if verificationLoading}
                                <Loader class="h-4 w-4 mr-2 animate-spin" />
                                {isUnverifying
                                    ? "Unverifying..."
                                    : "Verifying..."}
                            {:else if isUnverifying}
                                <X class="h-4 w-4 mr-2" /> Unverify Story
                            {:else}
                                <CheckCircle class="h-4 w-4 mr-2" /> Verify Story
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
