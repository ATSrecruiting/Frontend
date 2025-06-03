
<script lang="ts">
    import { Award } from "lucide-svelte";
    import CollapsibleSection from '$lib/components/ui/collapsible-section/CollapsibleSection.svelte';

    let { achievements } = $props<{ achievements: string[] }>();
</script>

<CollapsibleSection title="Key Achievements" icon={Award} initiallyExpanded={true}>
    <ul class="space-y-3">
        {#each achievements as achievement}
            <li class="flex items-start">
                <div class="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2.5 mr-3"></div>
                <span class="text-gray-700">{achievement}</span>
            </li>
        {/each}
    </ul>
</CollapsibleSection>