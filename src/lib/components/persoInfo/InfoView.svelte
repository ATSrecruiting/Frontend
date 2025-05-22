<script lang="ts">
    import { getCandidatePersonalInfo } from "$lib/services/candidates";
    import { onMount } from "svelte";
    import type { CandidatePersonalInfo } from "$lib/types/candidates";
    import { Skeleton } from "$lib/components/ui/skeleton";

    let { candidateId } = $props<string>();
    let isLoading = $state(true);
    let candidatePersonalInfo = $state<CandidatePersonalInfo>();

    async function loadCandidatesPersonalInfo(candidateId: string) {
        isLoading = true;
        try {
            const data = await getCandidatePersonalInfo(candidateId);
            if (data) {
                candidatePersonalInfo = data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        loadCandidatesPersonalInfo(candidateId);
    });

    let fullName = $derived(
        `${candidatePersonalInfo?.first_name} ${candidatePersonalInfo?.last_name}`,
    );
</script>

<div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
    <!-- Header section with name and job title -->
    <div class="flex flex-col space-y-1.5 p-6">
        {#if isLoading}
            <Skeleton class="h-8 w-3/4 mb-2" />
            <Skeleton class="h-4 w-1/2" />
        {:else}
            <h3 class="text-2xl font-semibold leading-none tracking-tight">
                {fullName}
            </h3>
            <p class="text-sm text-muted-foreground flex items-center gap-2">
                <!-- Briefcase Icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-muted-foreground"
                >
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {candidatePersonalInfo?.job_title}
            </p>
        {/if}
    </div>

    <!-- Info section with improved grid layout -->
    <div class="p-6 pt-0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Experience -->
            <div class="space-y-1">
                <p
                    class="text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                    <!-- Clock Icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-muted-foreground"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Years of Experience
                </p>
                {#if isLoading}
                    <Skeleton class="h-4 w-12" />
                {:else}
                    <p>
                        {candidatePersonalInfo?.years_of_experience}
                        {candidatePersonalInfo?.years_of_experience === 1
                            ? "year"
                            : "years"}
                    </p>
                {/if}
            </div>

            <!-- Phone -->
            <div class="space-y-1">
                <p
                    class="text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                    <!-- Phone Icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-muted-foreground"
                    >
                        <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        />
                    </svg>
                    Phone
                </p>
                {#if isLoading}
                    <Skeleton class="h-4 w-24" />
                {:else}
                    <p>{candidatePersonalInfo?.phone_number}</p>
                {/if}
            </div>

            <!-- Email -->
            <div class="space-y-1">
                <p
                    class="text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                    <!-- Email Icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-muted-foreground"
                    >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Email
                </p>
                {#if isLoading}
                    <Skeleton class="h-4 w-32" />
                {:else}
                    <a
                        href="mailto:{candidatePersonalInfo?.email}"
                        class="text-primary hover:underline truncate block"
                        title={candidatePersonalInfo?.email}
                        >{candidatePersonalInfo?.email}</a
                    >
                {/if}
            </div>

            <!-- Country -->
            <div class="space-y-1">
                <p
                    class="text-sm font-medium text-muted-foreground flex items-center gap-2"
                >
                    <!-- Globe Icon -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-muted-foreground"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path
                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                        />
                    </svg>
                    Country
                </p>
                {#if isLoading}
                    <Skeleton class="h-4 w-20" />
                {:else}
                    <p>{candidatePersonalInfo?.address.country}</p>
                {/if}
            </div>
        </div>

        <!-- Address section in full width -->
        <div class="space-y-1 mt-6">
            <p
                class="text-sm font-medium text-muted-foreground flex items-center gap-2"
            >
                <!-- Home Icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-muted-foreground"
                >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Address
            </p>
            {#if isLoading}
                <Skeleton class="h-4 w-48" />
            {:else}
                <p>{candidatePersonalInfo?.address.street}</p>
            {/if}
        </div>
    </div>
</div>
