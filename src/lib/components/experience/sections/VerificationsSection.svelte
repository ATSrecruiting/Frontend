<script lang="ts">
    import { Users, Shield } from "lucide-svelte";
    import CollapsibleSection from '$lib/components/ui/collapsible-section/CollapsibleSection.svelte';
    import VerificationCard from '$lib/components/ui/verification-card/VerificationCard.svelte';

    type Verification = {
        recruiter_id: string;
        recruiter_name: string;
        recruiter_company: string;
        verified_at: string;
        notes: string;
    };

    let { verifications } = $props<{ verifications: Verification[] }>();
</script>

<CollapsibleSection 
    title="Verifications ({verifications.length})" 
    icon={Users} 
    initiallyExpanded={true}
>
    {#if verifications.length > 0}
        <div class="space-y-4">
            {#each verifications as verification}
                <VerificationCard {verification} />
            {/each}
        </div>
    {:else}
        <div class="text-center py-6">
            <Shield class="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 text-sm">No verifications yet</p>
        </div>
    {/if}
</CollapsibleSection>