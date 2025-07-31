<script lang="ts">
  let { skill } = $props<{ skill: string }>();
</script>

<!-- Skill Tag -->
<span
  class="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md"
>
  {skill}
</span>
