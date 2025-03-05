<script lang="ts">
  import { goto } from "$app/navigation";
  import Register from "$lib/components/register/Register.svelte";

  const handleRegister = async (user_id: number) => {
    await goto(`/upload-resume?userId=${user_id}`);
  };
</script>

<Register navigate={handleRegister} />
