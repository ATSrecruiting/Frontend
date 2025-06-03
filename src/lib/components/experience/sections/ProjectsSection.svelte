<script lang="ts">
    import { Target } from "lucide-svelte";
    import CollapsibleSection from '$lib/components/ui/collapsible-section/CollapsibleSection.svelte';
    import ProjectCard from '$lib/components/ui/project-card/ProjectCard.svelte';
    import type {ListCandidateWorkExperienceProjectsResponse} from '$lib/types/candidates';
    import {getCandidateWorkExperienceProjects} from '$lib/services/candidates';
    import {onMount} from 'svelte';

    let {candidateid,  expId } = $props<{
        candidateid: string;
        expId: string;
    }>();


    let projects = $state<ListCandidateWorkExperienceProjectsResponse[]>([]);


    function FetchCandidateWorkExperienceProjects() {
        getCandidateWorkExperienceProjects(candidateid, expId).then((response) => {
            projects = response;
        }).catch((error) => {
            console.error("Failed to fetch projects:", error);
        });
    }

    onMount(() => {
        FetchCandidateWorkExperienceProjects();
    });


</script>

<CollapsibleSection 
    title="Projects ({projects.length})" 
    icon={Target} 
    initiallyExpanded={true}
>
    <div class="divide-y divide-gray-100">
        {#each projects as project}
            <ProjectCard {project} />
        {/each}
    </div>
</CollapsibleSection>