<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar/app-sidebar.svelte";
    
    let { children } = $props();
   </script>
    
    <div class="flex h-screen">
        <Sidebar.Provider class="flex w-full">
          <AppSidebar />
          <div class="flex flex-col flex-1">
            <Sidebar.Trigger class="p-4" />
            <main class="flex-1">
              {@render children?.()}
            </main>
          </div>
        </Sidebar.Provider>
      </div>