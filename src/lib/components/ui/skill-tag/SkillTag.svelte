<script lang="ts">
    let { skill } = $props<{ skill: string }>();
</script>

<span class="inline-flex items-center px-3 py-1 bg-black text-white text-sm rounded-md">
    {skill}
</span>