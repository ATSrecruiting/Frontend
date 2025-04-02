<script lang="ts">
  import Login from "$lib/components/login/Login.svelte";
  import { goto } from "$app/navigation";

  const handleLogin = async () => {
    await goto(`/dashboard`);
  };
</script>

<Login />
