<script lang="ts" module>
    declare global {
        interface Window {
            pdfjsLib: any;
        }
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import type { Attachments } from "$lib/types/candidates";

    // Document interface
    // Define props using $props rune
    let { documents = [] as Attachments[] } = $props();

    // Define reactive state using $state rune
    let currentIndex = $state(0);
    let modalOpen = $state(false);
    let pdfViewerLoaded = $state(false);

    // Utility functions
    function getDocumentType(document: Attachments) {
        const extension =
            document.file_path.split(".").pop()?.toLowerCase() || "";
        return extension === "pdf" ? "pdf" : "image";
    }

    // Navigation functions
    function next() {
        currentIndex = (currentIndex + 1) % documents.length;
        if (getDocumentType(documents[currentIndex]) === "pdf") {
            pdfViewerLoaded = false;
        }
    }

    function previous() {
        currentIndex = (currentIndex - 1 + documents.length) % documents.length;
        if (getDocumentType(documents[currentIndex]) === "pdf") {
            pdfViewerLoaded = false;
        }
    }

    function openModal() {
        currentIndex = 0; // Start with the first document
        modalOpen = true;
        if (getDocumentType(documents[currentIndex]) === "pdf") {
            pdfViewerLoaded = false;
        }
    }

    function closeModal() {
        modalOpen = false;
    }

    // PDF loading handler
    function onPdfLoaded() {
        pdfViewerLoaded = true;
    }

    // Keyboard navigation
    function handleKeydown(event: KeyboardEvent) {
        if (!modalOpen) return;
        if (event.key === "ArrowRight") {
            next();
        } else if (event.key === "ArrowLeft") {
            previous();
        } else if (event.key === "Escape") {
            closeModal();
        }
    }

    // Load PDF.js on mount
    onMount(() => {
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        };

        return () => {
            document.head.removeChild(script);
        };
    });
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Simple button to open the document viewer -->
<button
    class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
    onclick={openModal}
    disabled={documents.length === 0}
>
    View Documents ({documents.length})
</button>

<!-- Modal -->
{#if modalOpen}
    <div
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        transition:scale={{ duration: 200 }}
    >
        <button
            class="absolute inset-0 w-full h-full cursor-default"
            onclick={closeModal}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    closeModal();
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
                onclick={closeModal}
                aria-label="Close"
            >
                ×
            </button>

            <!-- Document viewer -->
            <div class="grow relative">
                {#if getDocumentType(documents[currentIndex]) === "pdf"}
                    <iframe
                        src={`${documents[currentIndex].file_path}#toolbar=0`}
                        title={documents[currentIndex].filename}
                        class="w-full h-full border-none"
                        onload={onPdfLoaded}
                    ></iframe>
                    {#if !pdfViewerLoaded}
                        <div
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 p-4 rounded"
                        >
                            Loading PDF...
                        </div>
                    {/if}
                {:else}
                    <img
                        src={documents[currentIndex].file_path}
                        alt={documents[currentIndex].filename}
                        class="max-w-full max-h-full object-contain"
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
                    onclick={previous}
                    aria-label="Previous document"
                >
                    ←
                </button>
                <span class="text-sm text-gray-500">
                    {currentIndex + 1} of {documents.length}
                </span>
                <button
                    type="button"
                    class="bg-blue-500 text-white border-none rounded px-4 py-2 cursor-pointer text-xl"
                    onclick={next}
                    aria-label="Next document"
                >
                    →
                </button>
            </div>
        </div>
    </div>
{/if}
