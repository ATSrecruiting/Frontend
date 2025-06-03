
<script lang="ts">
    import DescriptionSection from './sections/DescriptionSection.svelte';
    import AchievementsSection from './sections/AchievementsSection.svelte';
    import ProjectsSection from './sections/ProjectsSection.svelte';



    let { key_achievements, description , candidateId, expId } = $props<{
        key_achievements: string[] | null;
        description: string | null;
        candidateId: string;
        expId: string;
    }>();
</script>

<!-- Main Content Column -->
<div class="lg:col-span-2 space-y-8">
    <DescriptionSection description={description} />
    
    <AchievementsSection achievements={key_achievements} />
    
    <ProjectsSection candidateid= {candidateId} expId={expId} />
</div>
