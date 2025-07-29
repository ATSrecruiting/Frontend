<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Send } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { createEventDispatcher } from "svelte";

  let {
    isLoading = false,
    onsend,
  }: { isLoading?: boolean; onsend?: (message: string) => void } = $props();

  let currentMessage = $state<string>("");

  function sendMessage() {
    if (!currentMessage.trim() || isLoading) return;

    onsend?.(currentMessage.trim());
    currentMessage = "";
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior (new line)

      // Only submit if there's a message and not currently loading
      // Same validation as your button
      if (currentMessage.trim() && !isLoading) {
        sendMessage();
      }
    }
    // Shift + Enter will still create a new line (default behavior)
  }
</script>

<!-- Add background, backdrop blur, and proper z-index -->
<div class="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
  <div class="flex justify-center p-4">
    <div class="relative w-full max-w-1/2">
      <Textarea
        bind:value={currentMessage}
        placeholder="Type your message here."
        class="pr-12 min-h-20"
        onkeydown={handleKeydown}
        disabled={isLoading}
      />
      <Button
        class="absolute right-2 bottom-2 p-1.5 rounded-xl"
        onclick={sendMessage}
        disabled={!currentMessage.trim() || isLoading}
      >
        <Send class="size-4" />
      </Button>
    </div>
  </div>
</div>
