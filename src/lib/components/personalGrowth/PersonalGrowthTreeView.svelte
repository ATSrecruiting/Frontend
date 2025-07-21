<script lang="ts">
    import {
        getCandidatePersonalGrowth,
        unverifyPersonalGrowth,
        verifyPersonalGrowth,
    } from "$lib/services/candidates";
    import {
        ChevronDown,
        Paperclip,
        CheckCircle,
        Shield,
        Loader,
        Users,
        Info,
        X,
        School, // Added X icon for unverify
    } from "lucide-svelte";
    import { userStore } from "$lib/stores/userStore";
    import Carousel from "$lib/components/carousel/Carousel.svelte";
    import type { PersonalGrowthView } from "$lib/types/candidates";
    import { onMount } from "svelte";

    let { candidateId } = $props<{ candidateId: string }>();
    let isExpanded = $state(true);
    let personalGrowth = $state<PersonalGrowthView[]>([]);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);

    let currentPgId = $state<string>("");
    let modalOpen = $state(false);
    let verificationModal = $state(false);
    let persGrowthToVerify = $state<PersonalGrowthView | null>(null);
    let verificationLoading = $state(false);
    let verificationError = $state<string | null>(null);

    let isUnverifying = $state(false);

    let visibleVerifiers = $state<Record<string, boolean>>({});

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidatesPersonalGrowth(id: string) {
        isLoading = true;
        fetchError = null;

        try {
            const response = await getCandidatePersonalGrowth(id);
            personalGrowth = response;
        } catch (err) {
            fetchError =
                err instanceof Error
                    ? err.message
                    : "Failed to load personal growth data";
            console.error("Error fetching personal growth:", err);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (candidateId) {
            loadCandidatesPersonalGrowth(candidateId);
        } else {
            console.error("Candidate ID is missing.");
            fetchError = "Candidate ID is required.";
            isLoading = false;
            personalGrowth = [];
        }
    });

    function openDocumentCarousel(pgId: string) {
        currentPgId = pgId;
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }

    function getCurrentPersonalGrowth(): PersonalGrowthView | null {
        if (personalGrowth.length > 0) {
            return personalGrowth.find((pg) => pg.id === currentPgId) || null;
        }
        return null;
    }

    function isVerifiedByCurrentUser(pg: PersonalGrowthView): boolean {
        if (!pg.verifications || pg.verifications.length === 0) {
            return false;
        }

        const currentUserId = $userStore?.recruiter_id;
        if (!currentUserId) {
            return false;
        }
        return pg.verifications.some(
            (ver) => ver.recruiter_id === currentUserId,
        );
    }

    function openVerificationModal(pg: PersonalGrowthView, unverify = false) {
        persGrowthToVerify = pg;
        isUnverifying = unverify;
        verificationError = null;
        verificationModal = true;
    }

    function closeVerificationModal() {
        verificationModal = false;
        persGrowthToVerify = null;
        isUnverifying = false;
        verificationError = null;
    }

    async function handleVerifyPersonalGrowth() {
        if (!persGrowthToVerify) return;

        const pgIdToVerify = persGrowthToVerify.id;

        try {
            verificationLoading = true;
            verificationError = null;

            if (isUnverifying) {
                await unverifyPersonalGrowth(candidateId, pgIdToVerify);
            } else {
                await verifyPersonalGrowth(candidateId, pgIdToVerify);
            }

            await loadCandidatesPersonalGrowth(candidateId);
            closeVerificationModal();
        } catch (err) {
            verificationError =
                err instanceof Error
                    ? err.message
                    : "Failed to verify personal growth";
            console.error("Error verifying personal growth:", err);
        } finally {
            verificationLoading = false;
        }
    }

    function toggleVerifiers(pgId: string) {
        visibleVerifiers[pgId] = !visibleVerifiers[pgId];
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
            class="w-full flex items-center justify-between border-b-2 border-black pb-2 transition-all duration-200"
        >
            <div class="flex items-center">
                <h2 class="text-xl font-bold text-black mr-2">
                    Personal Growth
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
                    <Loader class="h-6 w-6 mr-2 animate-spin" /> Loading Personal
                    Growth...
                </div>
            {:else if fetchError}
                <div
                    class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
                >
                    Error loading data: {fetchError}
                </div>
            {:else if personalGrowth && personalGrowth.length > 0}
                <ul class="divide-y divide-gray-100">
                    {#each personalGrowth as pg (pg.id)}
                        {@const userVerified = isVerifiedByCurrentUser(pg)}
                        <li
                            class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200"
                        >
                            <!-- Black dot -->
                            <span
                                class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"
                            ></span>

                            <div class="space-y-1">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <p class="text-lg font-semibold">
                                            {pg.area_of_focus}
                                        </p>
                                        <p class="text-base font-medium">
                                            {pg.activity_method}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            {pg.timeframe}
                                        </p>
                                    </div>
                                    <div
                                        class="flex flex-col items-end space-y-1"
                                    >
                                        {#if pg.verifications && pg.verifications.length > 0}
                                            {@const count =
                                                pg.verifications.length}
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
                                                        by {pg.verifications[0]
                                                            .recruiter_name ??
                                                            "Unknown"}
                                                    </span>
                                                {:else if count > 1}
                                                    <button
                                                        type="button"
                                                        class="flex items-center text-gray-500 ml-1 hover:text-black transition-colors"
                                                        onclick={() =>
                                                            toggleVerifiers(
                                                                pg.id,
                                                            )}
                                                        aria-label="Show verifiers"
                                                    >
                                                        by {count} recruiters
                                                        <Info
                                                            class="h-3 w-3 ml-1"
                                                        />
                                                    </button>
                                                    {#if visibleVerifiers[pg.id]}
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
                                                                {#each pg.verifications as verification}
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
                                                onclick={() =>
                                                    openVerificationModal(
                                                        pg,
                                                        true,
                                                    )}
                                                aria-label={`Unverify personal growth ${pg.area_of_focus}`}
                                            >
                                                <X class="h-3 w-3 mr-1" />
                                                Unverify
                                            </button>
                                        {:else}
                                            <button
                                                type="button"
                                                class="inline-flex items-center text-xs font-medium text-gray-600 hover:text-black transition-colors mt-1"
                                                onclick={() =>
                                                    openVerificationModal(
                                                        pg,
                                                        false,
                                                    )}
                                                aria-label={`Verify personal growth ${pg.area_of_focus}`}
                                            >
                                                <Shield class="h-3 w-3 mr-1" />
                                                Verify
                                            </button>
                                        {/if}
                                    </div>
                                </div>

                                <p class="text-base text-gray-700 mt-1">
                                    {pg.description}
                                </p>

                                <!-- Skills Gained tags -->
                                {#if pg.skills_gained && pg.skills_gained.length > 0}
                                    <div class="flex flex-wrap gap-1 mt-2">
                                        {#each pg.skills_gained as skill}
                                            <span
                                                class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                                            >
                                                {skill}
                                            </span>
                                        {/each}
                                    </div>
                                {/if}

                                {#if pg.attachments && pg.attachments.length > 0}
                                    <button
                                        type="button"
                                        class="mt-2 inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                        onclick={() =>
                                            openDocumentCarousel(pg.id)}
                                    >
                                        <Paperclip class="h-4 w-4 mr-1" />
                                        View Documents ({pg.attachments.length})
                                    </button>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <div class="text-center py-6 text-gray-500">
                    No personal growth entries added for this candidate yet.
                </div>
            {/if}
        </div>
    {/if}
</div>

{#if modalOpen}
    {@const currentPG = getCurrentPersonalGrowth()}
    {#if currentPG}
        <Carousel attachment_ids={currentPG.attachments} onClose={closeModal} />
    {/if}
{/if}

{#if verificationModal && persGrowthToVerify}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">
                    {isUnverifying ? "Unverify" : "Verify"} Personal Growth
                </h3>
            </div>
            <div class="p-6">
                <div class="mb-4">
                    <p class="font-semibold text-gray-800">
                        {persGrowthToVerify.area_of_focus}
                    </p>
                    <p class="text-sm text-gray-600">
                        {persGrowthToVerify.activity_method}
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
                            onclick={handleVerifyPersonalGrowth}
                            disabled={verificationLoading}
                        >
                            {#if verificationLoading}
                                <Loader class="h-4 w-4 mr-2 animate-spin" />
                                {isUnverifying
                                    ? "Unverifying..."
                                    : "Verifying..."}
                            {:else if isUnverifying}
                                <X class="h-4 w-4 mr-2" /> Unverify Growth
                            {:else}
                                <CheckCircle class="h-4 w-4 mr-2" /> Verify Growth
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
