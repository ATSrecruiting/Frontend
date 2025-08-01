<script lang="ts">
    import ChatMessage from "$lib/components/shadChat/ChatMessage.svelte";
    import ChatInput from "$lib/components/shadChat/ChatInput.svelte";
    import type { Message } from "$lib/components/shadChat/types.d.ts";
    import Comobox from "$lib/components/shadChat/Comobox.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { sendMessageSSE } from "$lib/services/chat";
    import { toast } from "svelte-sonner";

    let session_id = page.url.searchParams.get("session_id");

    let messages = $state<Message[]>([]);

    let isLoading = $state<boolean>(false);
    let selectedModel = $state<string | null>(null);
    async function SetSelectedModel(modelName: string) {
        selectedModel = modelName;
    }

    async function handleSendMessage(message: string) {
        if (selectedModel === null) {
            toast.error("Please select a model before sending a message.");
            return;
        }
        const userInput = message;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content: userInput,
            role: "user",
            timestamp: new Date(),
        };

        messages = [...messages, userMessage];
        isLoading = true;

        try {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "",
                role: "assistant",
                timestamp: new Date(),
            };
            messages = [...messages, assistantMessage];

            const sseStream = sendMessageSSE({
                model: selectedModel,
                message: userInput,
                session_id: session_id,
            });

            for await (const event of sseStream) {
                if (event.event === "message" && event.data.delta) {
                    isLoading = false; // Stop loading when we receive a message
                    assistantMessage.content += event.data.delta;
                    messages = [
                        ...messages.slice(0, -1),
                        { ...assistantMessage },
                    ];
                } else if (event.event === "error") {
                    console.error("Error in SSE stream:", event.data);
                    isLoading = false;
                    return;
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            isLoading = false;
            return;
        }
    }

    // This will be the scrollable element
    let scrollContainer: HTMLElement;

    function scrollToBottom() {
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    // Use $effect to scroll to the bottom whenever the messages array changes.
    $effect(() => {
        // Add dependency on messages
        messages;
        // Use a timeout to wait for the DOM to update before scrolling
        setTimeout(scrollToBottom, 50);
    });
</script>

<div
    class="h-[calc(100vh-var(--header-height)-2rem-130px)] flex flex-col overflow-hidden"
>
    <Comobox setSelectedModel={SetSelectedModel} />
    <!--
    This is the message container.
    - `flex-1`: Allows this div to grow and take up all available vertical space.
    - `overflow-y-auto`: Adds a vertical scrollbar ONLY when the content overflows.
    - `min-h-0`: This is a crucial flexbox utility. It allows the container to shrink
      properly, which is necessary for the `overflow-y-auto` to work correctly.
  -->
    <div bind:this={scrollContainer} class="flex-1 overflow-y-auto min-h-0">
        <!-- The ChatMessage component is now simpler and only focuses on rendering messages. -->
        <ChatMessage {messages} {isLoading} />
    </div>

    <!--
    This is the input container.
    - `flex-shrink-0`: Prevents this div from shrinking, ensuring it's always
      visible at the bottom.
  -->
    <div class="flex-shrink-0">
        <ChatInput {isLoading} onsend={handleSendMessage} />
    </div>
</div>
