<script lang="ts">
  import {
    Pencil,
    ChevronDown,
    Plus,
    Trash2,
  } from "lucide-svelte";
  import type { SubmitResumeApiRequest } from "$lib/types/submitResume";
  import type { SuccessStory } from "$lib/types/uploadResume";



  let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();


  let editingIndex = $state(-1);
  let isExpanded = $state(true); 
  let isAddingNew = $state(false);

  let editFormData = $state<SuccessStory>({
    headline: "",
    situation: "",
    actions: "",
    results: "",
    skills: [],
    relevant_experience: "",
    timeframe: ""
  });

  let newSuccessStory = $state<SuccessStory>({
    headline: "",
    situation: "",
    actions: "",
    results: "",
    skills: [],
    relevant_experience: "",
    timeframe: ""
  });

  // New skill input for adding skills
  let newSkill = $state("");

  // Initialize success_stories array if it doesn't exist in the cvData
  if (!cvData?.cv_data?.success_stories) {
    cvData.cv_data.success_stories = [];
  }

  // Simplified functions using $state
  function handleEditClick(index: number, story: SuccessStory) {
    editingIndex = index;
    editFormData = { ...story };
    isAddingNew = false;
  }

  function handleCancelEdit() {
    editingIndex = -1;
  }

  function handleUpdateSuccessStory(index: number) {
    cvData.cv_data.success_stories[index] = editFormData;
    editingIndex = -1;
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function handleAddClick() {
    // Reset the new success story form and show it
    newSuccessStory = {
      headline: "",
      situation: "",
      actions: "",
      results: "",
      skills: [],
      relevant_experience: "",
      timeframe: ""
    };
    isAddingNew = true;
    editingIndex = -1; // Close any open edit forms
    newSkill = ""; // Reset new skill input
  }

  function handleCancelAdd() {
    isAddingNew = false;
  }

  function handleSaveNewSuccessStory() {
    // Initialize success_stories array if it doesn't exist
    if (!cvData.cv_data.success_stories) {
      cvData.cv_data.success_stories = [];
    }

    // Add the new success story to the array
    cvData.cv_data.success_stories.push({ ...newSuccessStory });

    // Reset the state
    isAddingNew = false;
  }

  function handleDeleteSuccessStory(index: number) {
    // Confirm before deleting
    if (confirm("Are you sure you want to delete this success story?")) {
      // Remove the item at the specified index
      cvData.cv_data.success_stories.splice(index, 1);

      // If we're currently editing this item, cancel editing
      if (editingIndex === index) {
        editingIndex = -1;
      } else if (editingIndex > index) {
        // Adjust editing index if we're editing an item that comes after the deleted one
        editingIndex--;
      }
    }
  }

  // Function to add a new skill to the editing form
  function addSkillToEditForm() {
    if (newSkill.trim() && !editFormData.skills.includes(newSkill.trim())) {
      editFormData.skills = [...editFormData.skills, newSkill.trim()];
      newSkill = "";
    }
  }

  // Function to add a new skill to the new story form
  function addSkillToNewForm() {
    if (newSkill.trim() && !newSuccessStory.skills.includes(newSkill.trim())) {
      newSuccessStory.skills = [...newSuccessStory.skills, newSkill.trim()];
      newSkill = "";
    }
  }

  // Function to remove a skill from the editing form
  function removeSkillFromEditForm(skill: string) {
    editFormData.skills = editFormData.skills.filter(s => s !== skill);
  }

  // Function to remove a skill from the new story form
  function removeSkillFromNewForm(skill: string) {
    newSuccessStory.skills = newSuccessStory.skills.filter(s => s !== skill);
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
        <h2 class="text-xl font-bold text-black mr-2">Success Stories</h2>
      </div>
      <div class="transform transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}">
        <ChevronDown class="h-5 w-5 text-black" />
      </div>
    </div>
  </button>

  {#if isExpanded}
    <div class="flow-root">
      <ul class="divide-y divide-gray-100">
        {#each cvData?.cv_data?.success_stories || [] as story, index}
          <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
            <!-- Black dot instead of red -->
            <span
              class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"
            ></span>

            {#if editingIndex === index}
              <!-- Edit form -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <label
                    for={`headline-${index}`}
                    class="block text-sm font-medium">Headline/Title</label
                  >
                  <input
                    id={`headline-${index}`}
                    type="text"
                    name="headline"
                    bind:value={editFormData.headline}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`situation-${index}`}
                    class="block text-sm font-medium">Situation/Challenge</label
                  >
                  <textarea
                    id={`situation-${index}`}
                    name="situation"
                    bind:value={editFormData.situation}
                    rows="3"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label
                    for={`actions-${index}`}
                    class="block text-sm font-medium">My Role & Actions</label
                  >
                  <textarea
                    id={`actions-${index}`}
                    name="actions"
                    bind:value={editFormData.actions}
                    rows="3"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label
                    for={`results-${index}`}
                    class="block text-sm font-medium">Results/Impact</label
                  >
                  <textarea
                    id={`results-${index}`}
                    name="results"
                    bind:value={editFormData.results}
                    rows="3"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium">Skills Demonstrated</label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    {#each editFormData.skills as skill}
                      <div class="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          onclick={() => removeSkillFromEditForm(skill)}
                          class="ml-1 text-gray-500 hover:text-black"
                          aria-label="Remove skill"
                        >
                          <span class="text-xs">×</span>
                        </button>
                      </div>
                    {/each}
                  </div>
                  <div class="flex">
                    <input
                      type="text"
                      bind:value={newSkill}
                      placeholder="Add a skill"
                      class="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      onclick={addSkillToEditForm}
                      class="rounded-r-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    for={`relevant-experience-${index}`}
                    class="block text-sm font-medium">Relevant Experience/Project</label
                  >
                  <input
                    id={`relevant-experience-${index}`}
                    type="text"
                    name="relevant_experience"
                    bind:value={editFormData.relevant_experience}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`timeframe-${index}`}
                    class="block text-sm font-medium">Timeframe</label
                  >
                  <input
                    id={`timeframe-${index}`}
                    type="text"
                    name="timeframe"
                    bind:value={editFormData.timeframe}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={() => handleUpdateSuccessStory(index)}
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
              <!-- Display mode -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold">{story.headline}</h3>
                  <div class="flex space-x-1">
                    <button
                      onclick={() => handleEditClick(index, story)}
                      class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Edit success story"
                      type="button"
                    >
                      <Pencil class="h-4 w-4 text-gray-500 hover:text-black" />
                    </button>
                    <button
                      onclick={() => handleDeleteSuccessStory(index)}
                      class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Delete success story"
                      type="button"
                    >
                      <Trash2
                        class="h-4 w-4 text-gray-500 hover:text-black"
                      />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-600">Situation/Challenge:</h4>
                  <p class="text-base text-gray-700">{story.situation}</p>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-600">My Role & Actions:</h4>
                  <p class="text-base text-gray-700">{story.actions}</p>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-600">Results/Impact:</h4>
                  <p class="text-base text-gray-700">{story.results}</p>
                </div>
                
                {#if story.skills && story.skills.length > 0}
                  <div>
                    <h4 class="text-sm font-medium text-gray-600">Skills Demonstrated:</h4>
                    <div class="flex flex-wrap gap-2 mt-1">
                      {#each story.skills as skill}
                        <span class="bg-gray-100 px-2 py-1 text-sm rounded-md">{skill}</span>
                      {/each}
                    </div>
                  </div>
                {/if}
                
                {#if story.relevant_experience}
                  <div>
                    <h4 class="text-sm font-medium text-gray-600">Relevant Experience:</h4>
                    <p class="text-base text-gray-700">{story.relevant_experience}</p>
                  </div>
                {/if}
                
                {#if story.timeframe}
                  <div>
                    <h4 class="text-sm font-medium text-gray-600">Timeframe:</h4>
                    <p class="text-base text-gray-700">{story.timeframe}</p>
                  </div>
                {/if}
              </div>
            {/if}
          </li>
        {/each}

        <!-- Add new success story button with improved styling -->
        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span
            class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black flex items-center justify-center"
          >
            <Plus class="h-2 w-2 text-white" />
          </span>

          {#if isAddingNew}
            <!-- Add new success story form -->
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="new-headline" class="block text-sm font-medium"
                  >Headline/Title</label
                >
                <input
                  id="new-headline"
                  type="text"
                  name="headline"
                  bind:value={newSuccessStory.headline}
                  placeholder="e.g., Led Team to Exceed Sales Target by 15%"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="space-y-2">
                <label for="new-situation" class="block text-sm font-medium"
                  >Situation/Challenge</label
                >
                <textarea
                  id="new-situation"
                  name="situation"
                  bind:value={newSuccessStory.situation}
                  placeholder="Describe the context and the problem or opportunity"
                  rows="3"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label for="new-actions" class="block text-sm font-medium"
                  >My Role & Actions</label
                >
                <textarea
                  id="new-actions"
                  name="actions"
                  bind:value={newSuccessStory.actions}
                  placeholder="What specific steps did you take? Focus on your individual contribution"
                  rows="3"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label for="new-results" class="block text-sm font-medium"
                  >Results/Impact</label
                >
                <textarea
                  id="new-results"
                  name="results"
                  bind:value={newSuccessStory.results}
                  placeholder="What was the outcome? Quantify if possible"
                  rows="3"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium">Skills Demonstrated</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  {#each newSuccessStory.skills as skill}
                    <div class="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onclick={() => removeSkillFromNewForm(skill)}
                        class="ml-1 text-gray-500 hover:text-black"
                        aria-label="Remove skill"
                      >
                        <span class="text-xs">×</span>
                      </button>
                    </div>
                  {/each}
                </div>
                <div class="flex">
                  <input
                    type="text"
                    bind:value={newSkill}
                    placeholder="e.g., Leadership, Problem-Solving"
                    class="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onclick={addSkillToNewForm}
                    class="rounded-r-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label for="new-relevant-experience" class="block text-sm font-medium"
                  >Relevant Experience/Project (Optional)</label
                >
                <input
                  id="new-relevant-experience"
                  type="text"
                  name="relevant_experience"
                  bind:value={newSuccessStory.relevant_experience}
                  placeholder="Link this story back to a specific job or project"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="space-y-2">
                <label for="new-timeframe" class="block text-sm font-medium"
                  >Timeframe</label
                >
                <input
                  id="new-timeframe"
                  type="text"
                  name="timeframe"
                  bind:value={newSuccessStory.timeframe}
                  placeholder="e.g., Q4 2023, January 2024"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="flex space-x-2">
                <button
                  type="button"
                  onclick={handleSaveNewSuccessStory}
                  class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Add Success Story
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
              Add success story
            </button>
          {/if}
        </li>
      </ul>
    </div>
  {/if}
</div>