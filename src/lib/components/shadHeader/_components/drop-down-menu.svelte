<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { authStore } from "$lib/services/auth.svelte";
  import { goto } from "$app/navigation";

  async function handleLogout() {
    try {
      await authStore.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error if necessary
    }
  }

  let { first_name, last_name } = $props<{
    first_name: string | undefined;
    last_name: string | undefined;
  }>();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="sm"
        class="dark:text-foreground hidden sm:flex"
        target="_blank"
        rel="noopener noreferrer"
      >
        {first_name}
        {last_name}
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Billing
        <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Settings
        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Keyboard shortcuts
        <DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onSelect={handleLogout}>
      Log out
      <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
