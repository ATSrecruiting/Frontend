<script lang="ts" generics="TData">
    import DataTable from "$lib/components/candidatesTable/data-table.svelte";
    import { columns } from "$lib/components/candidatesTable/columns";
    import type { ListCandidate } from "$lib/types/candidates";
    import {
        listCandidates,
        listCandidatesWithSimilaritySearch,
    } from "$lib/services/candidates";
    import { onMount } from "svelte";
    import type { Table } from "@tanstack/table-core";

    let candidatesData = $state<ListCandidate[]>([]);

    // State for pagination and loading
    let totalCandidates = $state(0);
    let error = $state<string | null>(null);

    async function loadCandidates(
        isSearchRequest = false,
        pageSize = 10,
        currentPage = 1,
        searchQuery = "",
    ) {
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
        }
    }

    onMount(() => {
        loadCandidates();
    });
    function handleSearch(e: Event, searchQuery: string) {
        e.preventDefault();
        loadCandidates(true, 10, 1, searchQuery);
    }
    function handlePreviousPage(table: Table<TData>) {
        if (table.getCanPreviousPage()) {
            table.previousPage();
            loadCandidates(
                false,
                10,
                table.getState().pagination.pageIndex + 1,
            );
        }
    }

    function handleNextPage(table: Table<TData>) {
        if (table.getCanNextPage()) {
            table.nextPage();
            loadCandidates(
                false,
                10,
                table.getState().pagination.pageIndex + 1,
            );
        }
    }
</script>

<!-- <div class="grid place-items-center">
    <div>
        <Table />
    </div>
</div> -->

<DataTable
    data={candidatesData}
    {columns}
    {handleSearch}
    {handlePreviousPage}
    {handleNextPage}
/>
