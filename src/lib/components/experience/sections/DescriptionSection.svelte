<script lang="ts">
    import CollapsibleSection from "$lib/components/ui/collapsible-section/CollapsibleSection.svelte";
    import { FileText } from "lucide-svelte";

    let { description, onEdit = () => {} } = $props<{
        description: string | null;
        onEdit?: () => void;
    }>();
</script>

<CollapsibleSection
    title="Description"
    icon={FileText}
    initiallyExpanded={true}
    {onEdit}
>
    {#if description}
        <div class="prose max-w-none text-gray-700">
            <p class="whitespace-pre-wrap">{description}</p>
        </div>
    {:else}
        <p class="text-gray-500 italic">No description provided</p>
    {/if}
</CollapsibleSection>
