<script lang="ts">
  import {
    Pencil,
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
  } from "lucide-svelte";
  import type { WorkExperience } from "$lib/types/uploadResume";
  import type { SubmitResumeApiRequest } from "$lib/types/submitResume";

  let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();

  // Using $state for reactive variables
  let editingIndex = $state(-1);
  let isExpanded = $state(true); // State to track if work experience section is expanded
  let isAddingNew = $state(false); // State to track if adding new experience
  let editFormData = $state<WorkExperience>({
    company: "",
    start_date: "",
    end_date: null,
    location: "",
    title: "",
  });

  let newWorkExperience = $state<WorkExperience>({
    company: "",
    start_date: "",
    end_date: null,
    location: "",
    title: "",
  });

  // Simplified functions using $state
  function handleEditClick(index: number, workExp: WorkExperience) {
    editingIndex = index;
    editFormData = { ...workExp };
    isAddingNew = false;
  }

  function handleCancelEdit() {
    editingIndex = -1;
  }

  function handleUpdateWorkExperience(index: number) {
    cvData.cv_data.work_experience[index] = editFormData;
    editingIndex = -1;
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function handleAddClick() {
    // Reset the new work experience form and show it
    newWorkExperience = {
      company: "",
      start_date: "",
      end_date: null,
      location: "",
      title: "",
    };
    isAddingNew = true;
    editingIndex = -1; // Close any open edit forms
  }

  function handleCancelAdd() {
    isAddingNew = false;
  }

  function handleSaveNewWorkExperience() {
    // Initialize work_experience array if it doesn't exist
    if (!cvData.cv_data.work_experience) {
      cvData.cv_data.work_experience = [];
    }

    // Add the new work experience to the array
    cvData.cv_data.work_experience.push({ ...newWorkExperience });

    // Reset the state
    isAddingNew = false;
  }

  function handleDeleteWorkExperience(index: number) {
    // Confirm before deleting
    if (confirm("Are you sure you want to delete this work experience?")) {
      // Remove the item at the specified index
      cvData.cv_data.work_experience.splice(index, 1);

      // If we're currently editing this item, cancel editing
      if (editingIndex === index) {
        editingIndex = -1;
      } else if (editingIndex > index) {
        // Adjust editing index if we're editing an item that comes after the deleted one
        editingIndex--;
      }
    }
  }
</script>

<div class="mt-6 relative">
  <!-- Work Experience Bubble at the start of the tree -->
  <button
    type="button"
    class="flex items-center mb-4 w-full text-left"
    onclick={toggleExpanded}
    onkeydown={(e) => e.key === "Enter" && toggleExpanded()}
    aria-expanded={isExpanded}
  >
    <div class="rounded-full bg-red-600 py-2 px-4 flex items-center z-10">
      {#if isExpanded}
        <ChevronDown class="h-4 w-4 text-white mr-2" />
      {:else}
        <ChevronRight class="h-4 w-4 text-white mr-2" />
      {/if}
      <h2 class="text-xl font-bold text-white">Work Experience</h2>
    </div>
  </button>

  {#if isExpanded}
    <div class="flow-root ml-3">
      <ul class="divide-y divide-gray-200">
        {#each cvData?.cv_data?.work_experience || [] as workExp, index}
          <li class="relative border-l border-gray-200 py-4 pl-8">
            <span
              class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600"
            ></span>

            {#if editingIndex === index}
              <!-- Edit form -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label
                    for={`company-${index}`}
                    class="block text-sm font-medium">Company</label
                  >
                  <input
                    id={`company-${index}`}
                    type="text"
                    name="company"
                    bind:value={editFormData.company}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label
                      for={`start-date-${index}`}
                      class="block text-sm font-medium">Start Date</label
                    >
                    <input
                      id={`start-date-${index}`}
                      type="text"
                      name="start_date"
                      bind:value={editFormData.start_date}
                      class="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      for={`end-date-${index}`}
                      class="block text-sm font-medium">End Date</label
                    >
                    <input
                      id={`end-date-${index}`}
                      type="text"
                      name="end_date"
                      bind:value={editFormData.end_date}
                      class="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    for={`location-${index}`}
                    class="block text-sm font-medium">Location</label
                  >
                  <input
                    id={`location-${index}`}
                    type="text"
                    name="location"
                    bind:value={editFormData.location}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`title-${index}`}
                    class="block text-sm font-medium">Title</label
                  >
                  <input
                    id={`title-${index}`}
                    type="text"
                    name="title"
                    bind:value={editFormData.title}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={() => handleUpdateWorkExperience(index)}
                    class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onclick={handleCancelEdit}
                    class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            {:else}
              <!-- Display mode -->
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <p class="text-lg font-semibold">{workExp.company}</p>
                  <div class="flex items-center">
                    <p class="text-sm text-gray-500 mr-2">
                      {workExp.start_date} - {workExp.end_date ?? "Present"}
                    </p>
                    <div class="flex space-x-1">
                      <button
                        onclick={() => handleEditClick(index, workExp)}
                        class="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Edit work experience"
                        type="button"
                      >
                        <Pencil class="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onclick={() => handleDeleteWorkExperience(index)}
                        class="p-1 rounded-full hover:bg-gray-100 hover:text-red-500"
                        aria-label="Delete work experience"
                        type="button"
                      >
                        <Trash2
                          class="h-4 w-4 text-gray-500 hover:text-red-500"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-base text-gray-500">{workExp.location}</p>
                <p class="text-base text-gray-500">{workExp.title}</p>
              </div>
            {/if}
          </li>
        {/each}

        <!-- Add new experience button at the end of the timeline -->
        <li class="relative border-l border-gray-200 py-4 pl-8">
          <span
            class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600 flex items-center justify-center"
          >
            <Plus class="h-2 w-2 text-white" />
          </span>

          {#if isAddingNew}
            <!-- Add new experience form -->
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="new-company" class="block text-sm font-medium"
                  >Company</label
                >
                <input
                  id="new-company"
                  type="text"
                  name="company"
                  bind:value={newWorkExperience.company}
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="new-start-date" class="block text-sm font-medium"
                    >Start Date</label
                  >
                  <input
                    id="new-start-date"
                    type="text"
                    name="start_date"
                    bind:value={newWorkExperience.start_date}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div class="space-y-2">
                  <label for="new-end-date" class="block text-sm font-medium"
                    >End Date</label
                  >
                  <input
                    id="new-end-date"
                    type="text"
                    name="end_date"
                    bind:value={newWorkExperience.end_date}
                    placeholder="Leave empty for 'Present'"
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="new-location" class="block text-sm font-medium"
                  >Location</label
                >
                <input
                  id="new-location"
                  type="text"
                  name="location"
                  bind:value={newWorkExperience.location}
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div class="space-y-2">
                <label for="new-title" class="block text-sm font-medium"
                  >Title</label
                >
                <input
                  id="new-title"
                  type="text"
                  name="title"
                  bind:value={newWorkExperience.title}
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div class="flex space-x-2">
                <button
                  type="button"
                  onclick={handleSaveNewWorkExperience}
                  class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                >
                  Add Experience
                </button>
                <button
                  type="button"
                  onclick={handleCancelAdd}
                  class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          {:else}
            <button
              class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
              type="button"
              onclick={handleAddClick}
            >
              Add work experience
            </button>
          {/if}
        </li>
      </ul>
    </div>
  {/if}
</div>
