<script lang="ts">
    import { Badge } from "$lib/components/ui/badge/index.js";

    let { tags, job_title } = $props<{
        tags: string[] | undefined;
        job_title: string;
    }>();
</script>

<div class="flex flex-col gap-2">
    <span class="text-gray-500">{job_title}</span>
    <div class="flex flex-row gap-1">
        {#each tags.slice(0, 3) as tag}
            <Badge variant="secondary">
                {tag}
            </Badge>
        {/each}
    </div>
</div>
