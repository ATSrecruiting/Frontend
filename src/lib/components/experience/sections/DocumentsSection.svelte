<script lang="ts">
    import { Paperclip } from "lucide-svelte";
    import CollapsibleSection from '$lib/components/ui/collapsible-section/CollapsibleSection.svelte';
    import DocumentItem from '$lib/components/ui/document-item/DocumentItem.svelte';

    type Attachment = {
        id: string;
        name: string;
        type: string;
    };

    let { attachments, openDocumentCarousel } = $props<{
        attachments: Attachment[];
        openDocumentCarousel: () => void;
    }>();
</script>

<CollapsibleSection 
    title="Documents ({attachments.length})" 
    icon={Paperclip} 
    initiallyExpanded={true}
>
    <div class="space-y-3 mb-4">
        {#each attachments as doc}
            <DocumentItem {doc} />
        {/each}
    </div>

    <button
        type="button"
        class="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        onclick={openDocumentCarousel}
    >
        View All Documents
    </button>
</CollapsibleSection>