<script lang="ts" generics="TData extends { id: number }, TValue">
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
  import { toast } from "svelte-sonner";
  import { Jumper } from "svelte-loading-spinners";
  import { CreateTempSession } from "$lib/services/chat";
  import { goto } from "$app/navigation";
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

  async function handleStartChat() {
    try {
      // get selected rows
      const selectedRows = table.getSelectedRowModel().rows;
      if (selectedRows.length === 0) {
        toast.error("Please select at least one candidate to start a chat.");
        return;
      }

      // Extract candidate IDs from selected rows
      const candidateIds = selectedRows.map((row) => row.original.id);
      if (candidateIds.length === 0) {
        alert("No candidates selected.");
        return;
      }

      const response = await CreateTempSession(candidateIds);
      const sessionId = response.session_id; // Assuming the response has a session_id field

      const queryParams = new URLSearchParams();
      queryParams.append("session_id", sessionId);

      goto(`/dashboard/chat?${queryParams.toString()}`);
    } catch (error) {
      alert("Failed to start chat session. Please try again.");
      console.error(error);
    }
  }
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
      <Button onclick={handleStartChat}><MessageCircle />Start Chat</Button>
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
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              <div class="flex items-center justify-center">
                <Jumper size="60" color="#141414" unit="px" duration="1s" />
              </div>
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
