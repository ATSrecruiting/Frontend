<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { MoonIcon, SunIcon } from "lucide-svelte";
  import { toggleMode } from "mode-watcher";
  import DropDownMenu from "./_components/drop-down-menu.svelte";
  let { first_name, last_name } = $props<{
    first_name: string | undefined;
    last_name: string | undefined;
  }>();
</script>

<header
  class="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
  <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    <Sidebar.Trigger class="-ml-1" />
    <Separator
      orientation="vertical"
      class="mx-2 data-[orientation=vertical]:h-4"
    />
    <h1 class="text-base font-medium">Documents</h1>
    <div class="ml-auto flex items-center gap-2">
      <Button onclick={toggleMode} variant="outline" size="icon">
        <SunIcon
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
        />
        <MoonIcon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
      <DropDownMenu {first_name} {last_name}></DropDownMenu>
    </div>
  </div>
</header>
