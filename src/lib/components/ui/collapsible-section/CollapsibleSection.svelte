<script lang="ts">
  import RoleGuard from "$lib/components/roles/RoleGuard.svelte";
  import { ChevronDown, Edit3 } from "lucide-svelte";
  import type { ComponentType } from "svelte";

  let {
    title,
    icon,
    initiallyExpanded = false,
    onEdit = () => {},
    children,
  } = $props<{
    title: string;
    icon?: ComponentType;
    initiallyExpanded?: boolean;
    onEdit?: () => void;
    children: any;
  }>();

  let expanded = $state(initiallyExpanded);

  function toggle() {
    expanded = !expanded;
  }

  function handleEdit(event: MouseEvent) {
    event.stopPropagation(); // Prevent section from collapsing
    onEdit();
  }
</script>

<div class="bg-card rounded-lg shadow-sm border border-border">
  <div
    class="w-full px-6 py-4 flex items-center justify-between border-b border-border"
  >
    <button
      type="button"
      class="flex-1 flex items-center hover:bg-muted transition-colors -mx-2 px-2 py-1 rounded"
      onclick={toggle}
    >
      <h2 class="text-lg font-semibold text-card-foreground flex items-center">
        {#if icon}
          {@const IconComponent = icon}
          <IconComponent class="h-5 w-5 mr-2" />
        {/if}
        {title}
      </h2>
    </button>

    <div class="flex items-center space-x-2">
      <RoleGuard user_type="candidate">
        <button
          type="button"
          onclick={handleEdit}
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        >
          <Edit3 class="h-3.5 w-3.5 mr-1" />
          Edit
        </button>
      </RoleGuard>

      <button
        type="button"
        onclick={toggle}
        class="p-1 hover:bg-muted rounded transition-colors"
      >
        <ChevronDown
          class="h-5 w-5 text-muted-foreground transform transition-transform {expanded
            ? 'rotate-180'
            : ''}"
        />
      </button>
    </div>
  </div>

  {#if expanded}
    <div class="p-6">
      {@render children()}
    </div>
  {/if}
</div>
