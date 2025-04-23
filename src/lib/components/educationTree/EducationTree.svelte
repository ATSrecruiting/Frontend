
<script lang="ts">
  import {
    Pencil,
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
  } from "lucide-svelte";
  import type { Education } from "$lib/types/uploadResume";
  import type { SubmitResumeApiRequest } from "$lib/types/submitResume";

  let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();

  let editingIndex = $state(-1);
  let isExpanded = $state(true);
  let isAddingNew = $state(false);

  let editFormData = $state<Education>({
    degree: "",
    major: "",
    school: "",
    graduation_date: null,
  });

  let newEducation = $state<Education>({
    degree: "",
    major: "",
    school: "",
    graduation_date: null,
  });

  function handleEditClick(index: number, edu: Education) {
    editingIndex = index;
    editFormData = { ...edu };
    isAddingNew = false;
  }

  function handleCancelEdit() {
    editingIndex = -1;
  }

  function handleUpdateEducation(index: number) {
    cvData.cv_data.education[index] = editFormData;
    editingIndex = -1;
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function handleAddClick() {
    newEducation = {
      degree: "",
      major: "",
      school: "",
      graduation_date: null,
    };
    isAddingNew = true;
    editingIndex = -1;
  }

  function handleCancelAdd() {
    isAddingNew = false;
  }

  function handleSaveNewEducation() {
    if (!cvData.cv_data.education) {
      cvData.cv_data.education = [];
    }
    cvData.cv_data.education.push({ ...newEducation });
    isAddingNew = false;
  }

  function handleDeleteEducation(index: number) {
    if (confirm("Are you sure you want to delete this education entry?")) {
      cvData.cv_data.education.splice(index, 1);
      if (editingIndex === index) {
        editingIndex = -1;
      } else if (editingIndex > index) {
        editingIndex--;
      }
    }
  }
</script>

<div class="mt-6 relative">
  <!-- Improved header/dropdown button -->
  <button
    type="button"
    class="flex items-center mb-4 w-full text-left group focus:outline-none"
    onclick={toggleExpanded}
    onkeydown={(e) => e.key === "Enter" && toggleExpanded()}
    aria-expanded={isExpanded}
  >
    <div class="w-full flex items-center justify-between border-b-2 border-black pb-2 transition-all duration-200">
      <div class="flex items-center">
        <h2 class="text-xl font-bold text-black mr-2">Education</h2>
      </div>
      <div class="transform transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}">
        <ChevronDown class="h-5 w-5 text-black" />
      </div>
    </div>
  </button>

  {#if isExpanded}
    <div class="flow-root">
      <ul class="divide-y divide-gray-100">
        {#each cvData?.cv_data?.education || [] as edu, index}
          <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
            <!-- Black dot instead of red -->
            <span
              class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"
            ></span>

            {#if editingIndex === index}
              <div class="space-y-4">
                <div class="space-y-2">
                  <label
                    for={`degree-${index}`}
                    class="block text-sm font-medium">Degree</label
                  >
                  <input
                    id={`degree-${index}`}
                    type="text"
                    name="degree"
                    bind:value={editFormData.degree}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`major-${index}`}
                    class="block text-sm font-medium">Major</label
                  >
                  <input
                    id={`major-${index}`}
                    type="text"
                    name="major"
                    bind:value={editFormData.major}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`school-${index}`}
                    class="block text-sm font-medium">School</label
                  >
                  <input
                    id={`school-${index}`}
                    type="text"
                    name="school"
                    bind:value={editFormData.school}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`graduation-date-${index}`}
                    class="block text-sm font-medium">Graduation Date</label
                  >
                  <input
                    id={`graduation-date-${index}`}
                    type="text"
                    name="graduation_date"
                    bind:value={editFormData.graduation_date}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={() => handleUpdateEducation(index)}
                    class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onclick={handleCancelEdit}
                    class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            {:else}
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <p class="text-lg font-semibold">{edu.school}</p>
                  <div class="flex items-center">
                    <p class="text-sm text-gray-500 mr-2">
                      {edu.graduation_date ?? "In Progress"}
                    </p>
                    <div class="flex space-x-1">
                      <button
                        onclick={() => handleEditClick(index, edu)}
                        class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Edit education"
                        type="button"
                      >
                        <Pencil class="h-4 w-4 text-gray-500 hover:text-black" />
                      </button>
                      <button
                        onclick={() => handleDeleteEducation(index)}
                        class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Delete education"
                        type="button"
                      >
                        <Trash2
                          class="h-4 w-4 text-gray-500 hover:text-black"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-base text-gray-700">{edu.degree}</p>
                <p class="text-base text-gray-700">{edu.major}</p>
              </div>
            {/if}
          </li>
        {/each}

        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span
            class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black flex items-center justify-center"
          >
            <Plus class="h-2 w-2 text-white" />
          </span>

          {#if isAddingNew}
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="new-degree" class="block text-sm font-medium"
                  >Degree</label
                >
                <input
                  id="new-degree"
                  type="text"
                  name="degree"
                  bind:value={newEducation.degree}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="space-y-2">
                <label for="new-major" class="block text-sm font-medium"
                  >Major</label
                >
                <input
                  id="new-major"
                  type="text"
                  name="major"
                  bind:value={newEducation.major}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="space-y-2">
                <label for="new-school" class="block text-sm font-medium"
                  >School</label
                >
                <input
                  id="new-school"
                  type="text"
                  name="school"
                  bind:value={newEducation.school}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="space-y-2">
                <label
                  for="new-graduation-date"
                  class="block text-sm font-medium">Graduation Date</label
                >
                <input
                  id="new-graduation-date"
                  type="text"
                  name="graduation_date"
                  bind:value={newEducation.graduation_date}
                  placeholder="Leave empty if in progress"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="flex space-x-2">
                <button
                  type="button"
                  onclick={handleSaveNewEducation}
                  class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Add Education
                </button>
                <button
                  type="button"
                  onclick={handleCancelAdd}
                  class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          {:else}
            <button
              class="text-black hover:text-gray-600 text-sm font-medium flex items-center transition-colors"
              type="button"
              onclick={handleAddClick}
            >
              Add education
            </button>
          {/if}
        </li>
      </ul>
    </div>
  {/if}
</div>