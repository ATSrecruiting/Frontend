<script lang="ts">
    import DescriptionSection from "./sections/DescriptionSection.svelte";
    import AchievementsSection from "./sections/AchievementsSection.svelte";
    import ProjectsSection from "./sections/ProjectsSection.svelte";
    import EditSidebar from "$lib/components/editSidebar/EditSideBar.svelte";
    import type { ListCandidateWorkExperienceProjectsResponse } from "$lib/types/candidates";

    let { key_achievements, description, candidateId, expId } = $props<{
        key_achievements: string[] | null;
        description: string | null;
        candidateId: string;
        expId: string;
    }>();

    let editSidebarOpen = $state(false);
    let currentEditSection = $state("");
    let projectsData = $state<ListCandidateWorkExperienceProjectsResponse[]>(
        [],
    );

    function handleProjectsDataFetched(data: any) {
        projectsData = data;
    }

    function openEdit(section: string) {
        currentEditSection = section;
        editSidebarOpen = true;
    }

    function closeEdit() {
        editSidebarOpen = false;
        currentEditSection = "";
    }

    function saveEdit(data: any) {
        if (currentEditSection === "Description") {
            description = data.description;
        } else if (currentEditSection === "Achievements") {
            key_achievements = data.achievements;
        } else if (currentEditSection === "Projects") {
            projectsData = data.projects;
        }
        closeEdit();
    }
</script>

<!-- Main Content Column -->
<div class="lg:col-span-2 space-y-8">
    <DescriptionSection {description} onEdit={() => openEdit("Description")} />

    <AchievementsSection
        achievements={key_achievements}
        onEdit={() => openEdit("Achievements")}
    />

    <ProjectsSection
        candidateid={candidateId}
        {expId}
        onEdit={() => openEdit("Projects")}
        onDataFetched={handleProjectsDataFetched}
    />
</div>

<!-- Edit Sidebar -->
<EditSidebar
    isOpen={editSidebarOpen}
    section={currentEditSection}
    onClose={closeEdit}
    onSave={saveEdit}
    description={description}
    achievements={key_achievements}
    {projectsData}
    candidateId={candidateId}
    expId={expId}

/>
