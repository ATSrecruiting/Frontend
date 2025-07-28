<script lang="ts">
  import ChatMessage from "$lib/components/shadChat/ChatMessage.svelte";
  import ChatInput from "$lib/components/shadChat/ChatInput.svelte";
  import type { Message } from "$lib/components/shadChat/types.d.ts";
  import Comobox from "$lib/components/shadChat/Comobox.svelte";
  import { onMount } from "svelte";

  let messages = $state<Message[]>([
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);

  let isLoading = $state<boolean>(false);
  let selectedModel = $state<string | null>(null);
  async function SetSelectedModel(modelName: string) {
    selectedModel = modelName;
  }

  // Mock LLM responses
  const mockResponses = [
    "I understand your question. Let me help you with that.",
    "That's an interesting point. Here's what I think about it...",
    "Based on what you've shared, I would suggest the following approach:",
    "Great question! This is a topic I can definitely help you explore.",
    "I see what you're getting at. Let me break this down for you:",
    "That's a common challenge many people face. Here are some strategies:",
    "Thank you for sharing that context. Based on your situation, I'd recommend:",
    "I appreciate you asking about this. Here's my perspective on the matter:",
  ];

  function generateMockResponse(): string {
    const baseResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const extensions = [
      " This approach has worked well for many users in similar situations.",
      " Would you like me to elaborate on any particular aspect?",
      " I hope this helps clarify things for you.",
      " Let me know if you need any additional information.",
      " Feel free to ask if you have any follow-up questions.",
    ];

    return (
      baseResponse + extensions[Math.floor(Math.random() * extensions.length)]
    );
  }

  async function handleSendMessage(message: string) {
    console.log("User input:", message);
    const userInput = message;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: "user",
      timestamp: new Date(),
    };

    messages = [...messages, userMessage];
    isLoading = true;

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: generateMockResponse(),
      sender: "assistant",
      timestamp: new Date(),
    };

    messages = [...messages, assistantMessage];
    isLoading = false;
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
  class="h-[calc(100vh-var(--header-height)-2rem-146px)] flex flex-col overflow-hidden"
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
