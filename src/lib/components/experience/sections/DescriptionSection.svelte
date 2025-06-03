<script lang="ts">
    import CollapsibleSection from '$lib/components/ui/collapsible-section/CollapsibleSection.svelte';

    let { description } = $props<{ description: string }>();
</script>

<CollapsibleSection title="Role Description" initiallyExpanded={true}>
    <p class="text-gray-700 leading-relaxed">
        {description}
    </p>
</CollapsibleSection>