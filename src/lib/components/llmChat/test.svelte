<script lang="ts">
    import { onMount } from "svelte";
    import { listCandidatesById } from "$lib/services/candidates";
    import { sendMessageSSE } from "$lib/services/chat"; // Added for SSE
    import { page } from "$app/state";

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

    let params = page.url.searchParams.getAll("candidates").map(Number);

    // Reactive state
    let messages = $state<ChatMessage[]>([]);
    let input = $state("");
    let isLoading = $state(false);
    let messagesEnd = $state<HTMLElement | null>(null);
    let inputElement = $state<HTMLInputElement | null>(null);
    let showCandidatePanel = $state(false);
    let candidatesLoading = $state(false);

    // Candidates state
    let candidates = $state<Candidate[]>([]);

    // Load initial candidates (example IDs, replace with actual IDs)
    async function loadInitialCandidates() {
        candidatesLoading = true;

        try {
            // You would normally get these IDs from somewhere else
            const candidateData = await listCandidatesById(params);

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
                message: userInput,
                candidates: selectedCandidateIds,
            });

            // Process the stream events
            for await (const event of sseStream) {
                if (event.event === "message" && event.data.delta) {
                    // Update the assistant message content with the new token
                    assistantMessage.content += event.data.delta;

                    // Important: Create a new array to trigger reactivity in Svelte
                    messages = [
                        ...messages.slice(0, -1),
                        { ...assistantMessage },
                    ];
                } else if (event.event === "error") {
                    // Handle error from the backend
                    assistantMessage.content += `\n\nError: ${event.data.error || "Something went wrong"}`;
                    messages = [
                        ...messages.slice(0, -1),
                        { ...assistantMessage },
                    ];
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
                : candidate,
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
        const mockId = Math.floor(Math.random() * 1000) + 10;

        candidatesLoading = true;
        try {
            const candidateData = await listCandidatesById([mockId]);
            if (candidateData.length > 0) {
                candidates = [
                    ...candidates,
                    { ...candidateData[0], selected: true },
                ];
            } else {
                // Fallback to mock data if API returns nothing
                candidates = [
                    ...candidates,
                    {
                        id: mockId,
                        first_name: "New",
                        last_name: "Candidate",
                        years_of_experience: 5,
                        job_title: "Software Developer",
                        selected: true,
                    },
                ];
            }
        } catch (error) {
            console.error("Failed to add new candidate:", error);
        } finally {
            candidatesLoading = false;
        }
    }

    // Get candidate icon
    function getCandidateIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
    }


</script>

<div class="h-full flex flex-col overflow-hidden bg-white text-black">
    {#if messages.length === 0}
        <!-- Empty state with centered input -->
        <div class="flex-grow flex flex-col items-center justify-center p-4">
            <h1 class="text-2xl font-semibold text-black mb-6">
                Chat about your candidates
            </h1>

            <!-- Candidates section just for the prompt-->
            
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
                                <polygon points="22 2 15 22 11 13 2 9 22 2"
                                ></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {:else}
        <!-- Chat area when there are messages -->
        <div class="flex-grow overflow-y-auto relative overflow-x-hidden">
            <!-- Candidate panel toggle button remove just for prompt -->


            <!-- Candidate panel (slide-in sidebar) -->


            <!-- In the message display section -->
            <div class="max-w-3xl mx-auto p-4 space-y-6">
                {#each messages as message, index (index)}
                    <div
                        class="flex {message.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'}"
                    >
                        <div
                            class="flex space-x-3 max-w-3xl {message.role ===
                            'user'
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
                                        <path
                                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                        />
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
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="2"
                                            ry="2"
                                        />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <circle cx="15.5" cy="8.5" r="1.5" />
                                        <path d="M7 13h10" />
                                    </svg>
                                {/if}
                            </div>

                            <!-- Message content -->
                            <div
                                class="px-3 py-2 rounded-lg {message.role ===
                                'user'
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
                                    {@html renderMessageContent(
                                        message.content,
                                    )}
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
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    />
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
                                <polygon points="22 2 15 22 11 13 2 9 22 2"
                                ></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
