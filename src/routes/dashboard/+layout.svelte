<script lang="ts">
  import Sidebar from "$lib/components/claudeSidebar/Sidebar.svelte";
  import Header from "$lib/components/claudeHeader/Header.svelte";
</script>

<div class="flex h-screen">
  <Sidebar
    logoSrc="https://apricot-tasha-63.tiiny.site/logoipsum-363-1.svg"
    logoAlt="Your Company"
    footerText="© 2025 Your Company"
  />
  <div class="flex-1 flex flex-col">
    <Header
      title="Dashboard"
      userProfile={{
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/profile-avatar.svg",
      }}
    />
    <main class="flex-1 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</div>
