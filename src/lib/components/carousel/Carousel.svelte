<script lang="ts" module>
    declare global {
        interface Window {
            pdfjsLib: any;
        }
    }
</script>

<script lang="ts">
    import { getWorkexperienceAttachments } from "$lib/services/attachements";

    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import type { Attachments } from "$lib/types/attachments";

    // Props
    let { attachment_ids, onClose } = $props<{
        attachment_ids: string[];
        onClose: () => void;
    }>();

    // Using $state for reactive variables
    let currentDocIndex = $state(0); // Track current document in carousel
    let pdfViewerLoaded = $state(false);
    let isLoading = $state(true);
    let attachments = $state<Attachments[]>([]);
    let error = $state<string | null>(null);
    let pdfIframe = $state<HTMLIFrameElement | null>(null);

    let currentDoc = $derived.by(() => {
        if (attachments.length > 0) {
            return attachments[currentDocIndex];
        }
        return null;
    });

    // Fetch file details when component mounts
    async function fetchFileDetails() {
        isLoading = true;
        error = null;

        try {
            const response = await getWorkexperienceAttachments(attachment_ids);
            attachments = response;
        } catch (err) {
            error = err instanceof Error ? err.message : "Failed to load files";
            console.error("Error fetching file details:", err);
        } finally {
            isLoading = false;
        }
    }

    // Document carousel functions
    function getDocumentType(filename: string) {
        if (!filename) return "";
        const extension = filename.split(".").pop()?.toLowerCase() || "";
        return extension === "pdf" ? "pdf" : "image";
    }

    function nextDocument() {
        if (attachments.length === 0) return;
        currentDocIndex = (currentDocIndex + 1) % attachments.length;
        pdfViewerLoaded = false;
    }

    function previousDocument() {
        if (attachments.length === 0) return;
        currentDocIndex =
            (currentDocIndex - 1 + attachments.length) % attachments.length;
        pdfViewerLoaded = false;
    }

    function handleIframeLoad() {
        pdfViewerLoaded = true;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowRight") {
            nextDocument();
        } else if (event.key === "ArrowLeft") {
            previousDocument();
        } else if (event.key === "Escape") {
            onClose();
        }
    }

    // Load data on mount
    onMount(() => {
        fetchFileDetails();

        return () => {
            // Any cleanup needed
        };
    });
</script>

<svelte:window on:keydown={handleKeydown} />

<div
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    transition:scale={{ duration: 200 }}
>
    <button
        class="absolute inset-0 w-full h-full cursor-default"
        onclick={onClose}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                onClose();
            }
        }}
        aria-label="Close modal"
    ></button>
    <div
        role="dialog"
        tabindex="-1"
        class="bg-white rounded-lg w-[90%] max-w-[1000px] h-[90vh] max-h-[800px] relative flex flex-col z-10"
    >
        <!-- Close button -->
        <button
            type="button"
            class="absolute top-2 right-2 bg-black/70 text-white border-none rounded-full w-8 h-8 text-2xl leading-none cursor-pointer z-10"
            onclick={onClose}
            aria-label="Close"
        >
            ×
        </button>

        <!-- Loading state -->
        {#if isLoading}
            <div class="grow flex items-center justify-center">
                <div class="bg-white/80 p-6 rounded text-lg">
                    Loading files...
                </div>
            </div>
            <!-- Error state -->
        {:else if error}
            <div class="grow flex items-center justify-center">
                <div class="bg-red-100 text-red-700 p-6 rounded">
                    <p>Error: {error}</p>
                    <button
                        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onclick={fetchFileDetails}
                    >
                        Retry
                    </button>
                </div>
            </div>
            <!-- No files state -->
        {:else if attachments.length === 0}
            <div class="grow flex items-center justify-center">
                <div class="bg-gray-100 p-6 rounded">No files to display</div>
            </div>
            <!-- Document viewer -->
        {:else if currentDoc}
            <div class="grow relative">
                {#if getDocumentType(currentDoc.filename) === "pdf"}
                    <div class="w-full h-full">
                        <iframe
                            bind:this={pdfIframe}
                            src={currentDoc.download_url}
                            title={currentDoc.filename}
                            class="w-full h-full border-none"
                            onload={handleIframeLoad}
                            sandbox="allow-scripts allow-same-origin"
                        ></iframe>
                    </div>
                    {#if !pdfViewerLoaded}
                        <div
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 p-4 rounded"
                        >
                            Loading PDF...
                        </div>
                    {/if}
                {:else}
                    <img
                        src={currentDoc.download_url}
                        alt={currentDoc.filename}
                        class="max-w-full max-h-full object-contain w-full h-full"
                    />
                {/if}
            </div>

            <!-- Navigation -->
            <div
                class="flex justify-between items-center p-4 border-t border-gray-200"
            >
                <button
                    type="button"
                    class="bg-blue-500 text-white border-none rounded px-4 py-2 cursor-pointer text-xl"
                    onclick={previousDocument}
                    aria-label="Previous document"
                >
                    ←
                </button>
                <span class="text-sm text-gray-500">
                    {currentDocIndex + 1} of {attachments.length}: {currentDoc.filename}
                </span>
                <button
                    type="button"
                    class="bg-blue-500 text-white border-none rounded px-4 py-2 cursor-pointer text-xl"
                    onclick={nextDocument}
                    aria-label="Next document"
                >
                    →
                </button>
            </div>
        {/if}
    </div>
</div>
