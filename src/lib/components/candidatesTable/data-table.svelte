<script lang="ts" generics="TData, TValue">
    import {
        type ColumnDef,
        type PaginationState,
        type RowSelectionState,
        getCoreRowModel,
        getPaginationRowModel,
        type Table as TanstackTable,
    } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { MessageCircle } from "lucide-svelte";
    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
    };

    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let searchQuery = $state("");
    let {
        data,
        columns,
        handleSearch,
        handlePreviousPage,
        handleNextPage,
    }: DataTableProps<TData, TValue> & {
        handleSearch: (e: Event, searchQuery: string) => void;
        handlePreviousPage: (table: TanstackTable<TData>) => void;
        handleNextPage: (table: TanstackTable<TData>) => void;
    } = $props();
    let rowSelection = $state<RowSelectionState>({});

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        state: {
            get pagination() {
                return pagination;
            },
            get rowSelection() {
                return rowSelection;
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                pagination = updater(pagination);
            } else {
                pagination = updater;
            }
        },
        onRowSelectionChange: (updater) => {
            if (typeof updater === "function") {
                rowSelection = updater(rowSelection);
            } else {
                rowSelection = updater;
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
</script>

<div>
    <div class="flex items-center py-4">
        <form
            onsubmit={(e) => handleSearch(e, searchQuery)}
            class="flex w-full max-w-sm items-center space-x-2"
        >
            <Input
                placeholder="Filter candidates"
                bind:value={searchQuery}
                class="max-w-sm"
            />
            <Button type="submit">Search</Button>
        </form>
        <div class="ml-auto flex items-center space-x-2">
            <Button><MessageCircle />Start Chat</Button>
        </div>
    </div>
    <div class="rounded-md border">
        <Table.Root>
            <Table.Header>
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <Table.Row>
                        {#each headerGroup.headers as header (header.id)}
                            <Table.Head colspan={header.colSpan}>
                                {#if !header.isPlaceholder}
                                    <FlexRender
                                        content={header.column.columnDef.header}
                                        context={header.getContext()}
                                    />
                                {/if}
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>
            <Table.Body>
                {#each table.getRowModel().rows as row (row.id)}
                    <Table.Row data-state={row.getIsSelected() && "selected"}>
                        {#each row.getVisibleCells() as cell (cell.id)}
                            <Table.Cell>
                                <FlexRender
                                    content={cell.column.columnDef.cell}
                                    context={cell.getContext()}
                                />
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {:else}
                    <Table.Row>
                        <Table.Cell
                            colspan={columns.length}
                            class="h-24 text-center"
                        >
                            No results.
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
    <div class="rounded-md border">
        <Table.Root>
            <!--- ... table implementation -->
        </Table.Root>
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
        <Button
            variant="outline"
            size="sm"
            onclick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
        >
            Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
            onclick={handleNextPage}
            disabled={!table.getCanNextPage()}
        >
            Next
        </Button>
    </div>
</div>
