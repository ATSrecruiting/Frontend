<script lang="ts">
    import { FileText, Image, Paperclip, Download } from "lucide-svelte";

    type Document = {
        id: string;
        name: string;
        type: string;
    };

    let { doc } = $props<{ doc: Document }>();

    function getFileIcon(type: string) {
        switch (type) {
            case "pdf":
                return FileText;
            case "image":
                return Image;
            default:
                return Paperclip;
        }
    }

    const IconComponent = getFileIcon(doc.type);
</script>

<div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
    <div class="flex items-center flex-1 min-w-0">
        <IconComponent class="h-4 w-4 mr-2 text-gray-500 shrink-0" />
        <span class="text-sm text-gray-700 truncate">{doc.name}</span>
    </div>
    <button
        type="button"
        class="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Download {doc.name}"
    >
        <Download class="h-4 w-4" />
    </button>
</div>