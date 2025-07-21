<script lang="ts">
    import { onMount } from "svelte";
    import type { ListCandidate, CandidateStatus } from "$lib/types/candidates";
    import {
        listCandidates,
        listCandidatesWithSimilaritySearch,
    } from "$lib/services/candidates";
    import { goto } from "$app/navigation";
    import { CreateTempSession } from "$lib/services/chat";

    // State for pagination and loading
    let currentPage = $state(1);
    let pageSize = $state(10);
    let totalCandidates = $state(0);
    let isLoading = $state(false);
    let error = $state<string | null>(null);

    // Search functionality
    let searchQuery = $state("");
    let isSearching = $state(false);

    // Initialize candidates data array
    let candidatesData = $state<ListCandidate[]>([]);

    // Load candidates from API
    async function loadCandidates(isSearchRequest = false) {
        isLoading = true;
        isSearching = isSearchRequest;
        error = null;
        try {
            // For normal pagination requests
            let data;
            if (!isSearchRequest) {
                data = await listCandidates(pageSize, currentPage);
            } else {
                // You will replace this with your similarity search API call
                // For example: data = await searchCandidates(searchQuery, pageSize, currentPage);
                data = await listCandidatesWithSimilaritySearch(
                    pageSize,
                    currentPage,
                    searchQuery,
                ); // Temporary placeholder
                console.log("Searching with query:", searchQuery);
            }

            // Important: Ensure data is an array before proceeding
            if (Array.isArray(data)) {
                // Create a new array instead of mutating the existing one
                candidatesData = [...data];

                // Set total count (in a real app, API would return this)
                totalCandidates =
                    data.length > 0
                        ? Math.max(
                              data.length + (currentPage - 1) * pageSize,
                              totalCandidates,
                          )
                        : totalCandidates;
            } else {
                throw new Error("Invalid data format received from API");
            }
        } catch (err) {
            error =
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred";
            console.error("Error fetching candidates:", err);
        } finally {
            isLoading = false;
            isSearching = false;
        }
    }

    // Handle search submission
    function handleSearch(e: Event) {
        e.preventDefault();
        currentPage = 1;
        loadCandidates(true); // Pass true to indicate this is a search request
    }

    // Clear search and reset to regular listing
    function clearSearch() {
        searchQuery = "";
        currentPage = 1;
        loadCandidates();
    }

    // Load data on component mount
    onMount(() => {
        loadCandidates();
    });

    // Handle pagination
    function handlePreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            loadCandidates(searchQuery !== "");
        }
    }

    function handleNextPage() {
        currentPage++;
        loadCandidates(searchQuery !== "");
    }

    // Status color mapping
    function getStatusColor(status: CandidateStatus): string {
        switch (status) {
            case "Applied":
                return "bg-blue-100 text-blue-800";
            case "Screening":
                return "bg-purple-100 text-purple-800";
            case "Interview":
                return "bg-yellow-100 text-yellow-800";
            case "Technical":
                return "bg-orange-100 text-orange-800";
            case "Offer":
                return "bg-green-100 text-green-800";
            case "Hired":
                return "bg-green-100 text-green-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    // Handle starting a chat with current candidates
    async function startChat() {
        try {
            // Get candidate IDs
            const candidateIds = candidatesData.map(
                (candidate) => candidate.id,
            );

            // Create temporary session and get session ID
            const response = await CreateTempSession(candidateIds);
            const sessionId = response.session_id; // Assuming the response has a session_id field

            // Create URL with session ID as parameter
            const queryParams = new URLSearchParams();
            queryParams.append("session_id", sessionId);

            // Navigate to chat page with session ID
            goto(`/dashboard/chat?${queryParams.toString()}`);
        } catch (error) {
            console.error("Error starting chat session:", error);
            // Handle error appropriately
        }
    }

    // Format date to more readable format
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    }

    // Generate initials from name
    function getInitials(first_name: string, last_name: string): string {
        return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
    }

    // Handle row click
    function handleRowClick(candidateId: number): void {
        goto(`/dashboard/candidates/${candidateId}`);
    }

    // Render star ratings
    function renderRating(rating: number): string {
        const maxRating = 5;
        let stars = "";

        for (let i = 1; i <= maxRating; i++) {
            if (i <= rating) {
                stars += "★"; // Filled star
            } else {
                stars += "☆"; // Empty star
            }
        }

        return stars;
    }
</script>

<div
    class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
>
    <!-- Table Header with Search - Simplified without filters -->
    <div class="p-4 border-b border-gray-200 bg-gray-50 space-y-4">
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
            <h2 class="text-xl font-semibold text-gray-800">Candidates</h2>

            <button
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                onclick={startChat}
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                </svg>
                Start a Chat
            </button>
        </div>

        <!-- Search bar -->
        <form onsubmit={handleSearch} class="flex flex-col sm:flex-row gap-2">
            <div class="grow relative">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                    <svg
                        class="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search candidates..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div class="flex gap-2">
                <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSearching}
                >
                    {#if isSearching}
                        <svg
                            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Searching...
                    {:else}
                        Search
                    {/if}
                </button>
                {#if searchQuery}
                    <button
                        type="button"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onclick={clearSearch}
                    >
                        Clear
                    </button>
                {/if}
            </div>
        </form>

        <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
                {#if searchQuery}
                    <span class="font-medium">Search results:</span> Showing
                    <span class="font-medium">{candidatesData.length}</span>
                    candidates for "{searchQuery}"
                {:else}
                    Showing <span class="font-medium"
                        >{candidatesData.length}</span
                    >
                    candidates
                {/if}
            </div>
        </div>
    </div>

    <!-- Loading state -->
    {#if isLoading}
        <div class="p-12 flex justify-center items-center">
            <div class="text-center">
                <svg
                    class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
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
                <p class="text-gray-600">Loading candidates...</p>
            </div>
        </div>
    {/if}

    <!-- Error state -->
    {#if error}
        <div class="p-6 text-center">
            <div class="bg-red-100 p-4 rounded-md text-red-800 mb-4">
                <p class="font-medium">Error loading candidates</p>
                <p>{error}</p>
            </div>
            <button
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onclick={() => loadCandidates(searchQuery !== "")}
            >
                Try Again
            </button>
        </div>
    {/if}

    <!-- Table -->
    {#if !isLoading && candidatesData.length > 0}
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Candidate
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Position
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Applied Date
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Rating
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each candidatesData as candidate}
                        <tr
                            class="hover:bg-gray-50 transition-colors cursor-pointer"
                            onclick={() => handleRowClick(candidate.id)}
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="shrink-0 h-10 w-10">
                                        {#if candidate.avatar}
                                            <img
                                                class="h-10 w-10 rounded-full"
                                                src={candidate.avatar}
                                                alt={candidate.first_name +
                                                    " " +
                                                    candidate.last_name}
                                            />
                                        {:else}
                                            <div
                                                class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
                                            >
                                                {getInitials(
                                                    candidate.first_name,
                                                    candidate.last_name,
                                                )}
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="ml-4">
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                        >
                                            {candidate.first_name}
                                            {candidate.last_name}
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            {candidate.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {candidate.job_title}
                                </div>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    {#each candidate.tags || [] as tag}
                                        <span
                                            class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
                                            >{tag}</span
                                        >
                                    {/each}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class={`px-2 py-1 text-xs rounded-full ${getStatusColor(candidate.status || "Applied")}`}
                                >
                                    {candidate.status}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                                {formatDate(candidate.created_at)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div
                                    class="text-sm text-yellow-500 font-medium"
                                >
                                    {renderRating(candidate.rating)}
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                            >
                                <div class="flex justify-end gap-2">
                                    <button
                                        class="text-blue-600 hover:text-blue-900"
                                        aria-label="Edit candidate"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            console.log(
                                                `Edit: ${candidate.id}`,
                                            );
                                        }}
                                    >
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            ></path>
                                        </svg>
                                    </button>
                                    <button
                                        class="text-red-600 hover:text-red-900"
                                        aria-label="Delete candidate"
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            console.log(
                                                `Delete: ${candidate.id}`,
                                            );
                                        }}
                                    >
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    <!-- No data state (only show when not loading and no error) -->
    {#if !isLoading && !error && candidatesData.length === 0}
        <div class="p-12 flex justify-center items-center">
            <div class="text-center">
                {#if searchQuery}
                    <!-- No search results -->
                    <svg
                        class="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                    <p class="text-xl font-medium text-gray-700 mb-2">
                        No results found
                    </p>
                    <p class="text-gray-500 mb-6">
                        Try adjusting your search query
                    </p>
                    <button
                        class="text-blue-600 hover:text-blue-800 font-medium"
                        onclick={clearSearch}
                    >
                        Clear search
                    </button>
                {:else}
                    <!-- No candidates at all -->
                    <svg
                        class="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                    </svg>
                    <p class="text-xl font-medium text-gray-700 mb-2">
                        No candidates yet
                    </p>
                    <p class="text-gray-500 mb-6">
                        Add your first candidate to get started
                    </p>
                    <button
                        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors mx-auto"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                        </svg>
                        Add Candidate
                    </button>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Table Footer with Pagination -->
    <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
        <nav class="flex items-center justify-between" aria-label="Pagination">
            <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                    Showing <span class="font-medium"
                        >{currentPage === 1
                            ? "1"
                            : (currentPage - 1) * pageSize + 1}</span
                    >
                    to
                    <span class="font-medium"
                        >{Math.min(
                            currentPage * pageSize,
                            totalCandidates,
                        )}</span
                    >
                    of <span class="font-medium">{totalCandidates}</span> results
                </p>
            </div>
            <div class="flex-1 flex justify-between sm:justify-end">
                <button
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1 || isLoading}
                    onclick={handlePreviousPage}
                >
                    Previous
                </button>
                <button
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={candidatesData.length < pageSize || isLoading}
                    onclick={handleNextPage}
                >
                    Next
                </button>
            </div>
        </nav>
    </div>
</div>
