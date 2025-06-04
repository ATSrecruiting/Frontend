<script lang="ts">
    import ExperienceHeader from '$lib/components/experience/ExperienceHeader.svelte';
    import ExperienceOverview from '$lib/components/experience/ExperienceOverview.svelte';
    import ExperienceContent from '$lib/components/experience/ExperienceContent.svelte';
    import ExperienceSidebar from '$lib/components/experience/ExperienceSidebar.svelte';
    import Carousel from "$lib/components/carousel/Carousel.svelte";
    import {onMount} from "svelte";

    import { getWorkExperienceVerifications,getCandidateWorkExperience, getCandidateWorkExperienceAttachments  } from "$lib/services/candidates";
    import type { VerificationDetailResponse, GetCandidateWorkExperienceResponse as Experience, ListAttachmentsResponse as Attachments  } from "$lib/types/candidates";
    import { page } from "$app/state";
  import { on } from 'svelte/events';

    // Props
    let candidateId = page.params.candidateId;
    let workExperienceId = page.params.expId;

    let verifications = $state<VerificationDetailResponse[]>([]);



    let  experience  = $state<Experience>({
        id: "",
        title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        employment_type: "Full-Time",
        skills: [],
        key_achievements: [],
        description: "",
        
    });


    let attachments = $state<Attachments[]>([])

    function fetchWorkExpereinceDetails() {
        getCandidateWorkExperience(candidateId, workExperienceId)
            .then((data) => {
                experience = data;
            })
            .catch((error) => {
                console.error("Error fetching work experience details:", error);
            });
    }


    onMount(() => {
        fetchWorkExpereinceDetails();
    });



    function fetchVerifications() {
        getWorkExperienceVerifications(candidateId, workExperienceId)
            .then((data) => {
                verifications = data;
            })
            .catch((error) => {
                console.error("Error fetching verifications:", error);
            });
    }
    onMount(() => {
        fetchVerifications();
        
    });

    function fetchAttachments() {
        getCandidateWorkExperienceAttachments(candidateId, workExperienceId)
            .then((data) => {
                attachments = data;
            })
            .catch((error) => {
                console.error("Error fetching attachments:", error);
            });
    }

    onMount(() => {
        fetchAttachments();
    });

    // Component State
    let modalOpen = $state(false);

    function openDocumentCarousel() {
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }
</script>

<div class="min-h-screen bg-gray-50">
    <ExperienceHeader 
        {candidateId} 
        verifications={verifications} 
    />

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExperienceOverview {experience}  />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ExperienceContent 
                key_achievements= {experience.key_achievements} 
                description = {experience.description}
                candidateId = {candidateId}
                expId = {workExperienceId} />
            
            <ExperienceSidebar 
                attachments={attachments}
                verifications={verifications}
                {openDocumentCarousel}
            />
        </div>
    </div>
</div>

<!-- {#if modalOpen}
    <Carousel
        attachment_ids={experience.attachments.map((a) => a.id)}
        onClose={closeModal}
    />
{/if} -->