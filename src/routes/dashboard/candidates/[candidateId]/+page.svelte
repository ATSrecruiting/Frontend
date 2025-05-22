<script lang="ts">
    import CandidateInfoCard from "$lib/components/persoInfo/InfoView.svelte";
    import ExperienceTreeView from "$lib/components/workExperienceTree/ExperienceTreeView.svelte";

    import { page } from "$app/state";
    import EducationtreeView from "$lib/components/educationTree/EducationtreeView.svelte";
    import CertificationTreeView from "$lib/components/certificationTree/CertificationTreeView.svelte";
    import PersonalGrowthTreeView from "$lib/components/personalGrowth/PersonalGrowthTreeView.svelte";

    let candidateId = page.params.candidateId;
    // Example candidate data
</script>

<div class="container" style="max-width: 800px; margin: 0 auto;">
    <CandidateInfoCard {candidateId} />

    <ExperienceTreeView {candidateId} />
    <EducationtreeView {candidateId} />
    <CertificationTreeView {candidateId} />
    <PersonalGrowthTreeView {candidateId} />
</div>
