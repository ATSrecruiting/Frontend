<script lang="ts">
    import CandidateInfoCard from "$lib/components/persoInfo/InfoView.svelte";
    import ExperienceTreeView from "$lib/components/workExperienceTree/ExperienceTreeView.svelte";

    import type { WorkExperienceView } from "$lib/types/candidates";
    import { onMount } from "svelte";

    import { page } from "$app/state";
    import EducationtreeView from "$lib/components/educationTree/EducationtreeView.svelte";
    import CertificationTreeView from "$lib/components/certificationTree/CertificationTreeView.svelte";

    let candidateId = page.params.candidateId;
    // Example candidate data
    const candidate = {
        firstName: "Jane",
        lastName: "Doe",
        jobTitle: "Senior Software Engineer",
        yearsOfExperience: 5,
        phoneNumber: "+1 (555) 123-4567",
        country: "United States",
        streetAddress: "123 Tech Lane, San Francisco, CA 94105",
        email: "jane.doe@example.com",
    };
</script>

<div class="container" style="max-width: 800px; margin: 0 auto;">
    <CandidateInfoCard {candidateId} />

    <ExperienceTreeView {candidateId} />
    <EducationtreeView {candidateId} />
    <CertificationTreeView {candidateId} />
</div>
