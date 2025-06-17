<script lang="ts">
    import { X, Save, RotateCcw, Plus } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";
    import type { ListCandidateWorkExperienceProjectsResponse } from "$lib/types/candidates";

    let {
        isOpen = false,
        section = "",
        onClose = () => {},
        onSave = () => {},
        achievements = [],
        projectsData = [],
    } = $props<{
        isOpen: boolean;
        section: string;
        onClose: () => void;
        onSave: () => void;
        achievements?: string[];
        projectsData?: ListCandidateWorkExperienceProjectsResponse[];
    }>();

    // Local state for managing achievements
    let localAchievements = $state<string[]>([]);
    let newAchievement = $state("");

    // Local state for managing projects
    let localProjects = $state<ListCandidateWorkExperienceProjectsResponse[]>(
        [],
    );
    let newProject = $state<
        Partial<ListCandidateWorkExperienceProjectsResponse>
    >({
        project_name: "",
        description: "",
        duration: "",
        team_size: null,
        impact: "",
    });

    // Initialize local achievements when the component opens or achievements prop changes
    $effect(() => {
        if (isOpen && section === "Achievements") {
            localAchievements = [...achievements];
        }
        if (isOpen && section === "Projects") {
            localProjects = [...projectsData];
        }
    });

    // Also initialize when props change while already open
    $effect(() => {
        if (section === "Achievements") {
            localAchievements = [...achievements];
        }
        if (section === "Projects") {
            localProjects = [...projectsData];
        }
    });

    function addAchievement() {
        if (newAchievement.trim()) {
            localAchievements = [...localAchievements, newAchievement.trim()];
            newAchievement = "";
        }
    }

    function updateAchievement(index: number, value: string) {
        localAchievements[index] = value;
    }

    function deleteAchievement(index: number) {
        localAchievements = localAchievements.filter((_, i) => i !== index);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            addAchievement();
        }
    }

    // Project management functions
    function addProject() {
        if (newProject.project_name?.trim()) {
            const projectToAdd: ListCandidateWorkExperienceProjectsResponse = {
                id: crypto.randomUUID(),
                work_experience_id: "", // This should be set by parent component
                project_name: newProject.project_name.trim(),
                description: newProject.description?.trim() || null,
                duration: newProject.duration?.trim() || null,
                team_size: newProject.team_size || null,
                impact: newProject.impact?.trim() || null,
            };

            localProjects = [...localProjects, projectToAdd];

            // Reset form
            newProject = {
                project_name: "",
                description: "",
                duration: "",
                team_size: null,
                impact: "",
            };
        }
    }

    function updateProject(
        index: number,
        field: keyof ListCandidateWorkExperienceProjectsResponse,
        value: any,
    ) {
        localProjects[index] = { ...localProjects[index], [field]: value };
    }

    function deleteProject(index: number) {
        localProjects = localProjects.filter((_, i) => i !== index);
    }

    function resetNewProject() {
        newProject = {
            project_name: "",
            description: "",
            duration: "",
            team_size: null,
            impact: "",
        };
    }

    function handleSave() {
        if (section === "Achievements") {
            console.log("Saving achievements:", localAchievements);
            // TODO: Call your API here with localAchievements
        } else if (section === "Projects") {
            console.log("Saving projects:", localProjects);
            // TODO: Call your API here with localProjects
        }
        onSave();
    }

    function handleCancel() {
        // Reset local state to original data
        if (section === "Achievements") {
            localAchievements = [...achievements];
            newAchievement = "";
        } else if (section === "Projects") {
            localProjects = [...projectsData];
            resetNewProject();
        }
        onClose();
    }
</script>

<!-- Backdrop -->
{#if isOpen}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        role="button"
        tabindex="0"
        onclick={onClose}
        onkeydown={(e) =>
            e.key === "Enter" || e.key === " " ? onClose() : null}
        transition:fade={{ duration: 200 }}
    ></div>
{/if}

<!-- Sidebar -->
<div
    class="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out {isOpen
        ? 'translate-x-0'
        : 'translate-x-full'}"
>
    {#if isOpen}
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div
                class="flex items-center justify-between p-6 border-b border-gray-200"
            >
                <h2 class="text-lg font-semibold text-gray-900">
                    Edit {section}
                </h2>
                <button
                    type="button"
                    onclick={onClose}
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X class="h-6 w-6" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
                {#if section === "Description"}
                    <div class="space-y-4">
                        <label
                            for="job-description"
                            class="block text-sm font-medium text-gray-700"
                        >
                            Job Description
                        </label>
                        <textarea
                            id="job-description"
                            class="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Describe the role and responsibilities..."
                        ></textarea>
                    </div>
                {:else if section === "Achievements"}
                    <div class="space-y-4">
                        <label
                            for="achievements-input"
                            class="block text-sm font-medium text-gray-700"
                        >
                            Key Achievements
                        </label>

                        <!-- Existing achievements list -->
                        <div class="space-y-3">
                            {#each localAchievements as achievement, index (index)}
                                <div
                                    class="flex items-start space-x-2"
                                    transition:slide={{ duration: 200 }}
                                >
                                    <input
                                        type="text"
                                        bind:value={localAchievements[index]}
                                        oninput={(e) =>
                                            e.target &&
                                            updateAchievement(
                                                index,
                                                (e.target as HTMLInputElement)
                                                    .value,
                                            )}
                                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter achievement..."
                                    />
                                    <button
                                        onclick={() => deleteAchievement(index)}
                                        class="text-red-500 hover:text-red-700 px-2 py-2 transition-colors"
                                        title="Delete achievement"
                                    >
                                        <X class="h-4 w-4" />
                                    </button>
                                </div>
                            {/each}

                            <!-- Show message when no achievements exist -->
                            {#if localAchievements.length === 0}
                                <div class="text-center py-8 text-gray-500">
                                    <p class="text-sm">
                                        No achievements added yet
                                    </p>
                                    <p class="text-xs mt-1">
                                        Add your first achievement below
                                    </p>
                                </div>
                            {/if}
                        </div>

                        <!-- Add new achievement input -->
                        <div class="flex items-center space-x-2 pt-2">
                            <input
                                id="new-achievement-input"
                                type="text"
                                bind:value={newAchievement}
                                onkeydown={handleKeyDown}
                                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add new achievement..."
                            />
                            <button
                                onclick={addAchievement}
                                disabled={!newAchievement.trim()}
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                title="Add achievement"
                            >
                                <Plus class="h-4 w-4" />
                            </button>
                        </div>

                        <p class="text-xs text-gray-500 mt-2">
                            Press Enter or click the + button to add an
                            achievement
                        </p>

                        <!-- Debug info - remove in production -->
                        {#if localAchievements.length > 0}
                            <div class="mt-4 p-3 bg-gray-50 rounded-md">
                                <p
                                    class="text-xs font-medium text-gray-600 mb-1"
                                >
                                    Current achievements:
                                </p>
                                <p class="text-xs text-gray-500">
                                    {localAchievements.length} total
                                </p>
                            </div>
                        {/if}
                    </div>
                {:else if section === "Projects"}
                    <div class="space-y-6">
                        <label class="block text-sm font-medium text-gray-700">
                            Projects
                        </label>

                        <!-- Existing projects list -->
                        <div class="space-y-4">
                            {#each localProjects as project, index (project.id)}
                                <div
                                    class="border border-gray-200 rounded-lg p-4 space-y-3"
                                    transition:slide={{ duration: 200 }}
                                >
                                    <!-- Project header with delete button -->
                                    <div
                                        class="flex items-start justify-between"
                                    >
                                        <div class="flex-1 space-y-3">
                                            <!-- Project Name -->
                                            <div>
                                                <label
                                                    class="block text-xs font-medium text-gray-600 mb-1"
                                                >
                                                    Project Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    bind:value={
                                                        localProjects[index]
                                                            .project_name
                                                    }
                                                    oninput={(e) =>
                                                        updateProject(
                                                            index,
                                                            "project_name",
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).value,
                                                        )}
                                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter project name..."
                                                />
                                            </div>

                                            <!-- Duration and Team Size Row -->
                                            <div class="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label
                                                        class="block text-xs font-medium text-gray-600 mb-1"
                                                    >
                                                        Duration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        bind:value={
                                                            localProjects[index]
                                                                .duration
                                                        }
                                                        oninput={(e) =>
                                                            updateProject(
                                                                index,
                                                                "duration",
                                                                (
                                                                    e.target as HTMLInputElement
                                                                ).value,
                                                            )}
                                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g., 3 months"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        class="block text-xs font-medium text-gray-600 mb-1"
                                                    >
                                                        Team Size
                                                    </label>
                                                    <input
                                                        type="number"
                                                        bind:value={
                                                            localProjects[index]
                                                                .team_size
                                                        }
                                                        oninput={(e) =>
                                                            updateProject(
                                                                index,
                                                                "team_size",
                                                                parseInt(
                                                                    (
                                                                        e.target as HTMLInputElement
                                                                    ).value,
                                                                ) || null,
                                                            )}
                                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g., 5"
                                                        min="1"
                                                    />
                                                </div>
                                            </div>

                                            <!-- Description -->
                                            <div>
                                                <label
                                                    class="block text-xs font-medium text-gray-600 mb-1"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    bind:value={
                                                        localProjects[index]
                                                            .description
                                                    }
                                                    oninput={(e) =>
                                                        updateProject(
                                                            index,
                                                            "description",
                                                            (
                                                                e.target as HTMLTextAreaElement
                                                            ).value,
                                                        )}
                                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows="2"
                                                    placeholder="Describe the project..."
                                                ></textarea>
                                            </div>

                                            <!-- Impact -->
                                            <div>
                                                <label
                                                    class="block text-xs font-medium text-gray-600 mb-1"
                                                >
                                                    Impact/Results
                                                </label>
                                                <textarea
                                                    bind:value={
                                                        localProjects[index]
                                                            .impact
                                                    }
                                                    oninput={(e) =>
                                                        updateProject(
                                                            index,
                                                            "impact",
                                                            (
                                                                e.target as HTMLTextAreaElement
                                                            ).value,
                                                        )}
                                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows="2"
                                                    placeholder="What impact did this project have?"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <!-- Delete button -->
                                        <button
                                            onclick={() => deleteProject(index)}
                                            class="ml-3 text-red-500 hover:text-red-700 transition-colors p-1"
                                            title="Delete project"
                                        >
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            {/each}

                            <!-- Show message when no projects exist -->
                            {#if localProjects.length === 0}
                                <div class="text-center py-8 text-gray-500">
                                    <p class="text-sm">No projects added yet</p>
                                    <p class="text-xs mt-1">
                                        Add your first project below
                                    </p>
                                </div>
                            {/if}
                        </div>

                        <!-- Add new project form -->
                        <div class="border-t pt-6">
                            <h3 class="text-sm font-medium text-gray-700 mb-4">
                                Add New Project
                            </h3>

                            <div class="space-y-4">
                                <!-- Project Name -->
                                <div>
                                    <label
                                        class="block text-xs font-medium text-gray-600 mb-1"
                                    >
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        bind:value={newProject.project_name}
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter project name..."
                                    />
                                </div>

                                <!-- Duration and Team Size Row -->
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            class="block text-xs font-medium text-gray-600 mb-1"
                                        >
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            bind:value={newProject.duration}
                                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., 3 months"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            class="block text-xs font-medium text-gray-600 mb-1"
                                        >
                                            Team Size
                                        </label>
                                        <input
                                            type="number"
                                            bind:value={newProject.team_size}
                                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., 5"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <!-- Description -->
                                <div>
                                    <label
                                        class="block text-xs font-medium text-gray-600 mb-1"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        bind:value={newProject.description}
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows="2"
                                        placeholder="Describe the project..."
                                    ></textarea>
                                </div>

                                <!-- Impact -->
                                <div>
                                    <label
                                        class="block text-xs font-medium text-gray-600 mb-1"
                                    >
                                        Impact/Results
                                    </label>
                                    <textarea
                                        bind:value={newProject.impact}
                                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows="2"
                                        placeholder="What impact did this project have?"
                                    ></textarea>
                                </div>

                                <!-- Add button -->
                                <button
                                    onclick={addProject}
                                    disabled={!newProject.project_name?.trim()}
                                    class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus class="h-4 w-4 mr-2" />
                                    Add Project
                                </button>
                            </div>
                        </div>

                        <!-- Debug info - remove in production -->
                        {#if localProjects.length > 0}
                            <div class="mt-4 p-3 bg-gray-50 rounded-md">
                                <p
                                    class="text-xs font-medium text-gray-600 mb-1"
                                >
                                    Current projects:
                                </p>
                                <p class="text-xs text-gray-500">
                                    {localProjects.length} total
                                </p>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Footer -->
            <div
                class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50"
            >
                <button
                    type="button"
                    onclick={handleCancel}
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    <RotateCcw class="h-4 w-4 mr-2" />
                    Cancel
                </button>
                <button
                    type="button"
                    onclick={handleSave}
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Save class="h-4 w-4 mr-2" />
                    Save Changes
                </button>
            </div>
        </div>
    {/if}
</div>
