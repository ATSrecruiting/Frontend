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

    // Props
    let { attachments, onClose } = $props<{
        attachments: Attachments[];
        onClose: () => void;
    }>();

    // Using $state for reactive variables
    let currentDocIndex = $state(0); // Track current document in carousel
    let pdfViewerLoaded = $state(false);
    let currentDoc = $derived(attachments[currentDocIndex]);

    // Document carousel functions
    function getDocumentType(url: string) {
        const extension = url.split(".").pop()?.toLowerCase() || "";
        return extension === "pdf" ? "pdf" : "image";
    }

    function nextDocument() {
        currentDocIndex = (currentDocIndex + 1) % attachments.length;

        if (getDocumentType(attachments[currentDocIndex].file_path) === "pdf") {
            pdfViewerLoaded = false;
        }
    }

    function previousDocument() {
        currentDocIndex =
            (currentDocIndex - 1 + attachments.length) % attachments.length;

        if (getDocumentType(attachments[currentDocIndex].file_path) === "pdf") {
            pdfViewerLoaded = false;
        }
    }

    function onPdfLoaded() {
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

    // Load PDF.js on mount
    onMount(() => {
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
            }
        };

        return () => {
            document.head.removeChild(script);
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
        <!-- Document viewer -->
        <div class="flex-grow relative">
            {#if getDocumentType(currentDoc.file_path) === "pdf"}
                <iframe
                    src={`${currentDoc.file_path}#toolbar=0`}
                    title={currentDoc.filename}
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
                    src={currentDoc.file_path}
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
                {currentDocIndex + 1} of {attachments.length}: {attachments[
                    currentDocIndex
                ].filename}
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
    </div>
</div>
