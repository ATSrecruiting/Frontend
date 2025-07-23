<script lang="ts">
  // import Sidebar from "$lib/components/claudeSidebar/Sidebar.svelte";
  // import Header from "$lib/components/claudeHeader/Header.svelte";
  import { getLoggedUser } from "$lib/services/user";
  import type { UserProfile } from "$lib/types/user";
  import { userStore } from "$lib/stores/userStore";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/shadSidebar/app-sidebar.svelte";
  import SiteHeader from "$lib/components/shadHeader/site-header.svelte";

  let { children } = $props();

  let user = $state<UserProfile>();

  async function getUserprofile() {
    try {
      user = await getLoggedUser();
      if (user) {
        userStore.set(user);
      } else {
        console.error("User not found");
        // Handle user not found state if necessary
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Handle error state if necessary
    }
  }

  $effect(() => {
    // This code runs after the component mounts
    getUserprofile();

    // Optional: Add a cleanup function if needed
    // return () => { /* cleanup code */ };
  });
</script>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <AppSidebar variant="inset" />

  <Sidebar.Inset>
    <SiteHeader first_name={user?.first_name} last_name={user?.last_name} />
    <main>
      {@render children?.()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>

<!-- <div class="flex h-screen bg-gray-50">
  <Sidebar
    logoSrc="https://apricot-tasha-63.tiiny.site/logoipsum-363-1.svg"
    logoAlt="Your Company"
    footerText="© 2025 Your Company"
  />\
  
  <div class="flex-1 flex flex-col">
    <Header title="Dashboard" userProfile={user} />
    <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
      <slot />
    </main>
  </div>
</div> -->
