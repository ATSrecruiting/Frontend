<script lang="ts">
import type {ListCandidateWorkExperienceProjectsResponse} from '$lib/types/candidates';

    let { project } = $props<{ project: ListCandidateWorkExperienceProjectsResponse }>();
</script>

<div class="p-6">
    <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900">
            {project.project_name}
        </h3>
        <div class="text-sm text-gray-500 text-right">
            <div>{project.duration}</div>
            <div>Team of {project.team_size}</div>
        </div>
    </div>

    <p class="text-gray-700 mb-4">
        {project.description}
    </p>

    <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Technologies
        </h4>
        <div class="flex flex-wrap gap-2">
            {#each project.technologies as tech}
                <span class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                    {tech}
                </span>
            {/each}
        </div>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-md p-3">
        <h4 class="text-sm font-medium text-green-800 mb-1">
            Impact
        </h4>
        <p class="text-sm text-green-700">
            {project.impact}
        </p>
    </div>
</div>