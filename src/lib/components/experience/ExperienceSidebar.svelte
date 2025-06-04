<script lang="ts">
    import DocumentsSection from './sections/DocumentsSection.svelte';
    import VerificationsSection from './sections/VerificationsSection.svelte';
       import type { VerificationDetailResponse, ListAttachmentsResponse as Attachments } from "$lib/types/candidates";



    let { attachments, verifications, openDocumentCarousel } = $props<{
        attachments: Attachments[];
        verifications: VerificationDetailResponse[];
        openDocumentCarousel: () => void;
    }>();
</script>

<!-- Sidebar -->
<div class="space-y-6">
    <DocumentsSection {attachments} {openDocumentCarousel} />
    
    <VerificationsSection {verifications} />
</div>