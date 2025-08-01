<script lang="ts">
  import { onMount } from "svelte";
  import { listCandidatesById } from "$lib/services/candidates";
  import { sendMessageSSE } from "$lib/services/chat"; // Added for SSE
  import { page } from "$app/state";
  import { renderMessageContent } from "./renderMessage";
  import Comobox from "./_components/Comobox.svelte";

  // Message interface
  interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
  }

  // Candidate interface
  interface Candidate {
    id: number;
    first_name: string;
    last_name: string;
    years_of_experience: number;
    job_title: string;
    selected: boolean;
  }

  let session_id = page.url.searchParams.get("session_id");

  // Reactive state
  let messages = $state<ChatMessage[]>([]);
  let selectedModel = $state<string | null>(null);
  let input = $state("");
  let isLoading = $state(false);
  let messagesEnd = $state<HTMLElement | null>(null);
  let inputElement = $state<HTMLInputElement | null>(null);
  let showCandidatePanel = $state(false);
  let candidatesLoading = $state(false);

  // Candidates state
  let candidates = $state<Candidate[]>([]);

  async function SetSelectedModel(modelName: string) {
    selectedModel = modelName;
  }

  // Load initial candidates (example IDs, replace with actual IDs)
  async function loadInitialCandidates() {
    candidatesLoading = true;

    try {
      // You would normally get these IDs from somewhere else
      const candidateData = await listCandidatesById(session_id);

      // Transform API response to include selected property
      candidates = candidateData.map((candidate) => ({
        ...candidate,
        selected: true,
      }));
    } catch (error) {
      console.error("Failed to load initial candidates:", error);
    } finally {
      candidatesLoading = false;
    }
  }

  // Scroll to bottom
  $effect(() => {
    if (messages && messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Focus input and load candidates on mount
  onMount(() => {
    if (inputElement) {
      inputElement.focus();
    }
    loadInitialCandidates();
  });

  onMount(() => {
    // Get the header height and set it as a CSS variable
    const header = document.querySelector("header"); // Update selector if needed
    if (header) {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerHeight}px`
      );
    } else {
      // Fallback if header not found
      document.documentElement.style.setProperty("--header-height", "64px");
    }
  });

  // Handle form submission
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    // Add user message
    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    messages = [...messages, userMessage];
    const userInput = input;
    input = "";
    isLoading = true;

    try {
      // Get selected candidate IDs
      const selectedCandidateIds = candidates
        .filter((c) => c.selected)
        .map((c) => c.id.toString());

      // Create a placeholder message for streaming response
      const assistantMessage = {
        role: "assistant" as const,
        content: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Add the empty assistant message to the messages array
      messages = [...messages, assistantMessage];

      // Call the SSE endpoint with our message and selected candidates
      const sseStream = sendMessageSSE({
        model: selectedModel,
        message: userInput,
        session_id: session_id,
      });

      // Process the stream events
      for await (const event of sseStream) {
        if (event.event === "message" && event.data.delta) {
          // Update the assistant message content with the new token
          assistantMessage.content += event.data.delta;

          // Important: Create a new array to trigger reactivity in Svelte
          messages = [...messages.slice(0, -1), { ...assistantMessage }];
        } else if (event.event === "error") {
          // Handle error from the backend
          assistantMessage.content += `\n\nError: ${event.data.error || "Something went wrong"}`;
          messages = [...messages.slice(0, -1), { ...assistantMessage }];
        }
      }
    } catch (error) {
      console.error("Error in chat stream:", error);
      // Add error message to the chat
      const errorMessage = {
        role: "assistant" as const,
        content: `Error: ${error instanceof Error ? error.message : "Failed to connect to the assistant"}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      messages = [...messages, errorMessage];
    } finally {
      isLoading = false;
    }
  }

  // Toggle candidate selection
  function toggleCandidateSelection(id: number) {
    candidates = candidates.map((candidate) =>
      candidate.id === id
        ? { ...candidate, selected: !candidate.selected }
        : candidate
    );
  }

  // Toggle candidate panel visibility
  function toggleCandidatePanel() {
    showCandidatePanel = !showCandidatePanel;
  }

  // Get selected candidates count
  function getSelectedCandidatesCount() {
    return candidates.filter((candidate) => candidate.selected).length;
  }

  // Remove candidate from the list
  function removeCandidate(id: number) {
    candidates = candidates.filter((candidate) => candidate.id !== id);
  }

  // Add new candidate manually (in a real app, you'd likely search for candidates instead)
  async function addNewCandidate() {
    // In a real implementation, this would open a search interface or form
    // For demo purposes, we'll add a mock candidate with a random ID
    // const mockId = Math.floor(Math.random() * 1000) + 10;
    // candidatesLoading = true;
    // try {
    //     const candidateData = await listCandidatesById([mockId]);
    //     if (candidateData.length > 0) {
    //         candidates = [
    //             ...candidates,
    //             { ...candidateData[0], selected: true },
    //         ];
    //     } else {
    //         // Fallback to mock data if API returns nothing
    //         candidates = [
    //             ...candidates,
    //             {
    //                 id: mockId,
    //                 first_name: "New",
    //                 last_name: "Candidate",
    //                 years_of_experience: 5,
    //                 job_title: "Software Developer",
    //                 selected: true,
    //             },
    //         ];
    //     }
    // } catch (error) {
    //     console.error("Failed to add new candidate:", error);
    // } finally {
    //     candidatesLoading = false;
    // }
  }

  // Get candidate icon
  function getCandidateIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  }

  // Simple markdown-like rendering for code blocks
  // Enhanced markdown-like rendering for LLM responses with fixed line break handling
</script>

<div class="h-full flex flex-col overflow-hidden bg-white text-black">
  <Comobox setSelectedModel={SetSelectedModel} />
  {#if messages.length === 0}
    <!-- Empty state with centered input -->
    <div class="grow flex flex-col items-center justify-center p-4">
      <h1 class="text-2xl font-semibold text-black mb-6">
        Chat about your candidates
      </h1>

      <!-- Candidates section -->
      <div
        class="w-full max-w-xl mb-8 bg-gray-50 rounded-lg border border-gray-200 p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-medium">Candidate Library</h2>
          <button
            on:click={addNewCandidate}
            class="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
            aria-label="Add new candidate"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Add Candidate
          </button>
        </div>

        {#if candidatesLoading}
          <div class="py-6 text-center text-gray-500">
            <svg
              class="animate-spin h-6 w-6 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Loading candidates...</p>
          </div>
        {:else if candidates.length > 0}
          <div class="space-y-2 max-h-48 overflow-y-auto">
            {#each candidates as candidate}
              <div
                class="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200"
              >
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id={`candidate-${candidate.id}`}
                    checked={candidate.selected}
                    on:change={() => toggleCandidateSelection(candidate.id)}
                    class="mr-3 h-4 w-4"
                  />
                  <div class="flex items-center">
                    <span class="text-gray-500 mr-2">
                      {@html getCandidateIcon()}
                    </span>
                    <div>
                      <div class="text-sm font-medium truncate max-w-xs">
                        {candidate.first_name}
                        {candidate.last_name}
                      </div>
                      <div class="text-xs text-gray-500">
                        {candidate.job_title} · {candidate.years_of_experience}
                        years
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  on:click={() => removeCandidate(candidate.id)}
                  class="text-gray-400 hover:text-gray-600"
                  aria-label="Remove candidate"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            {/each}
          </div>
          <div class="mt-3 text-sm text-gray-500">
            {getSelectedCandidatesCount()} of {candidates.length} candidates selected
          </div>
        {:else}
          <div
            class="py-6 flex flex-col items-center justify-center text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mb-2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <p class="text-sm">No candidates added yet</p>
          </div>
        {/if}
      </div>

      <div class="w-full max-w-xl">
        <form on:submit={handleSubmit} class="relative">
          <div
            class="relative rounded-full bg-gray-100 border border-gray-300 flex items-center"
          >
            <input
              bind:this={inputElement}
              bind:value={input}
              type="text"
              class="w-full rounded-full bg-transparent p-4 pr-12 text-black focus:outline-none"
              placeholder="Ask about your candidates..."
              disabled={isLoading}
            />
            <button
              type="submit"
              aria-label="Send message"
              class="absolute right-3 rounded-full p-2 {input.trim() &&
              !isLoading
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500'}"
              disabled={!input.trim() || isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  {:else}
    <!-- Chat area when there are messages -->
    <div class="grow overflow-y-auto relative overflow-x-hidden">
      <!-- Candidate panel toggle button (fixed position) -->
      <button
        on:click={toggleCandidatePanel}
        class="fixed top-24 right-6 z-20 bg-white bg-opacity-90 rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
        aria-label={showCandidatePanel ? "Hide candidates" : "Show candidates"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        {#if !showCandidatePanel && getSelectedCandidatesCount() > 0}
          <span
            class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >{getSelectedCandidatesCount()}</span
          >
        {/if}
      </button>

      <!-- Candidate panel (fixed sidebar) -->
      <div
        class="fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-20 transition-all duration-300 transform shadow-lg {showCandidatePanel
          ? 'translate-x-0 w-80'
          : 'translate-x-full w-0'} overflow-hidden"
        style="top: var(--header-height, 64px); height: calc(100vh - var(--header-height, 64px));"
      >
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h2 class="font-medium">
            Candidates ({getSelectedCandidatesCount()} selected)
          </h2>
          <button
            on:click={toggleCandidatePanel}
            class="text-gray-500 hover:text-gray-700"
            aria-label="Close candidates panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="p-4">
          <button
            on:click={addNewCandidate}
            class="w-full mb-4 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Add New Candidate
          </button>

          {#if candidatesLoading}
            <div class="py-6 text-center text-gray-500">
              <svg
                class="animate-spin h-6 w-6 mx-auto mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p>Loading candidates...</p>
            </div>
          {:else}
            <div class="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {#each candidates as candidate}
                <div
                  class="flex p-3 bg-gray-50 rounded-lg border {candidate.selected
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200'}"
                >
                  <input
                    type="checkbox"
                    id={`sidebar-candidate-${candidate.id}`}
                    checked={candidate.selected}
                    on:change={() => toggleCandidateSelection(candidate.id)}
                    class="mr-3 h-4 w-4 mt-1"
                  />
                  <div class="grow overflow-hidden">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-gray-500">
                        {@html getCandidateIcon()}
                      </span>
                      <span class="font-medium text-sm truncate"
                        >{candidate.first_name}
                        {candidate.last_name}</span
                      >
                    </div>
                    <div class="flex justify-between text-xs text-gray-500">
                      <span>{candidate.job_title}</span>
                      <span
                        >{candidate.years_of_experience}
                        years</span
                      >
                    </div>
                  </div>
                  <button
                    on:click={() => removeCandidate(candidate.id)}
                    class="ml-2 text-gray-400 hover:text-gray-600 self-start"
                    aria-label="Remove candidate"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- In the message display section, remove the reference candidates part -->
      <div class="max-w-3xl mx-auto p-4 pt-10 pr-16 space-y-6">
        {#each messages as message, index (index)}
          <div
            class="flex {message.role === 'user'
              ? 'justify-end'
              : 'justify-start'}"
          >
            <div
              class="flex space-x-3 max-w-3xl {message.role === 'user'
                ? 'flex-row-reverse'
                : ''}"
            >
              <!-- Avatar -->
              <div
                class="flex-none w-8 h-8 rounded-full overflow-hidden flex items-center justify-center
                    {message.role === 'user'
                  ? 'bg-black text-white'
                  : message.role === 'system'
                    ? 'bg-gray-400'
                    : 'bg-black text-white'}"
              >
                {#if message.role === "user"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                {:else}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <circle cx="15.5" cy="8.5" r="1.5" />
                    <path d="M7 13h10" />
                  </svg>
                {/if}
              </div>

              <!-- Message content -->
              <div
                class="px-3 py-2 rounded-lg {message.role === 'user'
                  ? 'bg-gray-100'
                  : message.role === 'system'
                    ? 'text-gray-600 italic'
                    : 'bg-gray-50 border border-gray-200'}"
              >
                <div
                  class={message.role === "system"
                    ? "text-sm italic"
                    : "text-sm"}
                >
                  {@html renderMessageContent(message.content)}
                </div>
                <div class="text-xs mt-1 text-gray-500">
                  {message.timestamp}
                </div>
              </div>
            </div>
          </div>
        {/each}

        <!-- Loading indicator -->
        {#if isLoading}
          <div class="flex justify-start">
            <div class="flex space-x-3 max-w-3xl">
              <div
                class="flex-none w-8 h-8 rounded-full overflow-hidden bg-black text-white flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <circle cx="15.5" cy="8.5" r="1.5" />
                  <path d="M7 13h10" />
                </svg>
              </div>
              <div
                class="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center"
              >
                <div class="flex space-x-1">
                  <div
                    class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  ></div>
                  <div
                    class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style="animation-delay: 0.2s"
                  ></div>
                  <div
                    class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style="animation-delay: 0.4s"
                  ></div>
                </div>
                <span class="ml-2 text-xs text-gray-500"
                  >Analyzing candidates...</span
                >
              </div>
            </div>
          </div>
        {/if}

        <div bind:this={messagesEnd}></div>
      </div>
    </div>

    <!-- Input area at the bottom when there are messages -->
    <div class="flex-none p-4 border-t border-gray-300 bg-white">
      <div class="max-w-3xl mx-auto">
        <form on:submit={handleSubmit} class="relative">
          <div
            class="relative rounded-full bg-gray-100 border border-gray-300 flex items-center"
          >
            <input
              bind:value={input}
              type="text"
              class="w-full rounded-full bg-transparent p-4 pr-12 text-black focus:outline-none"
              placeholder="Ask about your candidates..."
              disabled={isLoading}
            />
            <button
              type="submit"
              aria-label="Send message"
              class="absolute right-3 rounded-full p-2 {input.trim() &&
              !isLoading
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500'}"
              disabled={!input.trim() || isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
