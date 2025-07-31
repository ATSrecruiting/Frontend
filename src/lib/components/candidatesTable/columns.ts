import type { ListCandidate, CandidateStatus } from "$lib/types/candidates";
import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableAvatar from "./data-table-avatar.svelte";
import DataTableCheckbox from "./data-table-checkbox.svelte";
import DataTableJobTitle from "./data-table-job-title.svelte";
import DataTableActions from "./data-table-actions.svelte";





export const columns: ColumnDef<ListCandidate>[] = [
    {
        id: "select",
        header: ({ table }) =>
            renderComponent(DataTableCheckbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate:
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value: any) => table.toggleAllPageRowsSelected(!!value),
                "aria-label": "Select all"
            }),
        cell: ({ row }) =>
            renderComponent(DataTableCheckbox, {
                checked: row.getIsSelected(),
                onCheckedChange: (value: any) => row.toggleSelected(!!value),
                "aria-label": "Select row"
            }),
        enableSorting: false,
        enableHiding: false
    },
    {
        id: "avatar",
        cell: ({ row }) => {
            return renderComponent(DataTableAvatar, {
                first_name: row.original.first_name,
                last_name: row.original.last_name
            });
        }
    },
    {
        id: "full_name",
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        header: "Name",

    },
    {
        id: "job_title",
        cell: ({ row }) => {
            return renderComponent(DataTableJobTitle, {
                job_title: row.original.job_title,
                tags: row.original.tags
            });
        },
        header: "Job Title",
    },
        {
        id: "years_of_experience",
        cell : ({ row }) => {
            return `${row.original.years_of_experience} years`;
        },
        header: "Experience",
    },
    {
        accessorKey: "status",
        header: "Status",

    },
    {
        id: "application_date",
        accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
        header: "Application Date",
    },
      {
    id: "actions",
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { id: row.original.id });
    },
  },


]
