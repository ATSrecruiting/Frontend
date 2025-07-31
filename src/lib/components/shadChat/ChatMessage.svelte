<script lang="ts">
  import { renderMessageContent } from "../llmChat/renderMessage.js";
  import type { Message } from "./types.js";

  let {
    messages,
    isLoading,
  }: {
    messages?: Message[];
    isLoading?: boolean;
  } = $props();

  // All scrolling logic and state (scrollArea, scrollToBottom, onMount, $effect)
  // have been removed from this component and moved to the parent page,
  // where the layout is controlled.
</script>

<!--
  The component is now much simpler. It no longer contains the ScrollArea or
  any layout-specific classes like `flex-1`. Its only job is to render the
  list of messages. The `mx-auto` class keeps the message thread centered.
-->
<div class="w-full max-w-4xl mx-auto">
  <!--
    EDIT: Increased bottom padding from pb-6 to pb-40 (10rem).
    This adds space at the bottom of the message list to prevent it
    from being obscured by the absolutely positioned chat input component.
  -->
  <div class="flex flex-col gap-4 p-4 pb-40">
    {#each messages || [] as message (message.id)}
      {#if message.content && message.content.trim() !== ""}
        <div
          class="flex {message.role === 'user'
            ? 'justify-end'
            : 'justify-start'}"
        >
          <div
            class="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-4 py-3 text-sm {message.role ===
            'user'
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted'}"
          >
            <div class="whitespace-pre-wrap">
              {@html renderMessageContent(message.content)}
            </div>
            <div class="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      {/if}
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <div
          class="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-4 py-3 text-sm bg-muted"
        >
          <div class="flex items-center gap-2">
            <div class="flex gap-1">
              <div
                class="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"
              ></div>
              <div
                class="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"
              ></div>
              <div class="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            </div>
            <span class="text-xs opacity-70">Thinking...</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  .animate-bounce {
    animation: bounce 1.4s ease-in-out infinite both;
  }
</style>
