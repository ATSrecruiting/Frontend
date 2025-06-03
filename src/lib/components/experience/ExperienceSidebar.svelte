<script lang="ts">
    import DocumentsSection from './sections/DocumentsSection.svelte';
    import VerificationsSection from './sections/VerificationsSection.svelte';
       import type { VerificationDetailResponse } from "$lib/types/candidates";

    type Attachment = {
        id: string;
        name: string;
        type: string;
    };


    let { attachments, verifications, openDocumentCarousel } = $props<{
        attachments: Attachment[];
        verifications: VerificationDetailResponse[];
        openDocumentCarousel: () => void;
    }>();
</script>

<!-- Sidebar -->
<div class="space-y-6">
    <DocumentsSection {attachments} {openDocumentCarousel} />
    
    <VerificationsSection {verifications} />
</div>