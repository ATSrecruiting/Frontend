<script>
    import { authStore } from "$lib/services/auth.svelte.js";

    let {
        user_type = null,
        // roles = null,
        // permission = null,
        // permissions = null,
        // requireAll = false,
        fallback = null,
        children,
    } = $props();

    const hasAccess = $derived(
        (() => {
            if (!authStore.isAuthenticated) return false;

            // Check roles
            if (user_type) {
                return authStore.checkUserAccountType(user_type);
            }
            return false;
        })(),
    );
</script>

{#if hasAccess}
    {@render children()}
{:else if fallback}
    {@render fallback()}
{/if}
