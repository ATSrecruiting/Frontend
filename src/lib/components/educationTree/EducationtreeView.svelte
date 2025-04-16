<script lang="ts">
  import { getCandidateEducation } from "$lib/services/candidates";
  import { userStore } from "$lib/stores/userStore";
  import type { EducationView } from "$lib/types/candidates";
  import { onMount } from "svelte";





    let {candidateId} = $props<{candidateId: string}>();
    let isExpanded = $state(true);
    let education = $state<EducationView[]>([]);
    let isLoading = $state(true);
    let fetchError = $state<string | null>(null);

    let currentEducId = $state<string>("");
    let modalOpen = $state(false);

    let verificationModal = $state(false);
    let educationToVerify = $state<EducationView | null>(null);
    let verificationError = $state<string | null>(null);
    let isUnverifying = $state(false);

    let visivleVerifiers = $state<Record<string, boolean>>({});

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    async function loadCandidatesEducation(id: string) {
        isLoading = true;
        fetchError = null;

        try {
            const response = await getCandidateEducation(id);
            education = response;
        } catch (err) {
            fetchError = err instanceof Error ? err.message : "Failed to load candidates education";
            console.error("Error fetching candidates education:", err);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        if (candidateId) {
            loadCandidatesEducation(candidateId);
        } else {
            console.error("Candidate ID is missing.");
            fetchError = "Candidate ID is required.";
            isLoading = false;
            education = [];
        }
    });


    function openDocumentCarousel(EdId: string) {
        currentEducId = EdId;
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }

    function getCurrentEducation() : EducationView | null {
        if (education.length > 0) {
            return education.find((ed) => ed.id === currentEducId) || null;
        }
        return null;
    }

    function isVerifiedByCurrentUser(educ: EducationView): boolean {
        if (!educ.verifications || educ.verifications.length === 0) {
            return false;
        }

        const currentUserId = $userStore?.recruiter_id;
        if (!currentUserId) {
            return false;
        }
        return educ.verifications.some((ver) => ver.recruiter_id === currentUserId);
    }

    function openVerificationModal(educ: EducationView, unverify = false) {
        educationToVerify = educ;
        isUnverifying = unverify;
        verificationError = ""  ;
        verificationModal = true;
    }

    function closeVerificationModal() {
        verificationModal = false;
        educationToVerify = null;
        isUnverifying = false;
    }



</script>