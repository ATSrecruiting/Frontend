<script lang="ts">
    import {
      Pencil,
      ChevronDown,
      ChevronRight,
      Plus,
      Trash2
    } from "lucide-svelte";
    import type { SubmitResumeApiRequest } from "$lib/types/submitResume";
    import type { PersonalGrowth } from "$lib/types/uploadResume";
  
    let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();
    
    let editingIndex = $state(-1);
    let isExpanded = $state(true);
    let isAddingNew = $state(false);

    let editFormData = $state<PersonalGrowth>({
      area_of_focus: "",
      activity_method: "",
      description: "",
      timeframe: "",
      skills_gained: []
    });

    let newPersonalGrowth = $state<PersonalGrowth>({
      area_of_focus: "",
      activity_method: "",
      description: "",
      timeframe: "",
      skills_gained: []
    });

    let newCustomSkill = $state("");
    let editCustomSkill = $state("");

    const defaultSkills = [
      'Leadership', 'Communication', 'Problem Solving', 'Technical Skills', 
      'Creativity', 'Teamwork', 'Public Speaking', 'Confidence', 
      'Organization', 'Team Management'
    ];
  
    function toggleExpanded() {
      isExpanded = !isExpanded;
    }
  
    function handleAddClick() {
      isAddingNew = true;
      editingIndex = -1;
      // Reset new personal growth form
      newPersonalGrowth = {
        area_of_focus: "",
        activity_method: "",
        description: "",
        timeframe: "",
        skills_gained: []
      };
      newCustomSkill = "";
    }
  
    function handleCancelAdd() {
      isAddingNew = false;
    }
  
    function handleEditClick(index: number) {
      editingIndex = index;
      isAddingNew = false;
      // Copy the existing data to the edit form
      const growthToEdit = cvData.cv_data.personal_growth[index];
      editFormData = {
        area_of_focus: growthToEdit.area_of_focus,
        activity_method: growthToEdit.activity_method,
        description: growthToEdit.description,
        timeframe: growthToEdit.timeframe,
        skills_gained: [...growthToEdit.skills_gained]
      };
      editCustomSkill = "";
    }
  
    function handleCancelEdit() {
      editingIndex = -1;
    }

    function handleSaveNewPersonalGrowth() {
      if (!cvData.cv_data.personal_growth) {
        cvData.cv_data.personal_growth = [];
      }
      
      // Add the new personal growth to the cv data
      cvData.cv_data.personal_growth = [
        ...cvData.cv_data.personal_growth,
        { ...newPersonalGrowth }
      ];
      
      // Reset the form
      handleCancelAdd();
    }

    function handleUpdateExistingGrowth(index: number) {
      if (!cvData.cv_data.personal_growth) {
        cvData.cv_data.personal_growth = [];
      }
      
      // Update the existing personal growth item
      cvData.cv_data.personal_growth[index] = { ...editFormData };
      
      // Close the edit form
      handleCancelEdit();
    }

    function handleDeleteGrowth(index: number) {
      if (cvData.cv_data.personal_growth) {
        // Filter out the item at the specified index
        cvData.cv_data.personal_growth = cvData.cv_data.personal_growth.filter((_: unknown, i: number) => i !== index);
      }
    }

    function toggleSkillInNew(skill: string) {
      if (newPersonalGrowth.skills_gained.includes(skill)) {
        newPersonalGrowth.skills_gained = newPersonalGrowth.skills_gained.filter(s => s !== skill);
      } else {
        newPersonalGrowth.skills_gained = [...newPersonalGrowth.skills_gained, skill];
      }
    }

    function toggleSkillInEdit(skill: string) {
      if (editFormData.skills_gained.includes(skill)) {
        editFormData.skills_gained = editFormData.skills_gained.filter(s => s !== skill);
      } else {
        editFormData.skills_gained = [...editFormData.skills_gained, skill];
      }
    }

    function addCustomSkillToNew() {
      if (newCustomSkill && !newPersonalGrowth.skills_gained.includes(newCustomSkill)) {
        newPersonalGrowth.skills_gained = [...newPersonalGrowth.skills_gained, newCustomSkill];
        newCustomSkill = "";
      }
    }

    function addCustomSkillToEdit() {
      if (editCustomSkill && !editFormData.skills_gained.includes(editCustomSkill)) {
        editFormData.skills_gained = [...editFormData.skills_gained, editCustomSkill];
        editCustomSkill = "";
      }
    }
  </script>
  
  <div class="mt-6 relative">
    <!-- Header/dropdown button -->
    <button
      type="button"
      class="flex items-center mb-4 w-full text-left group focus:outline-none"
      onclick={toggleExpanded}
      onkeydown={(e) => e.key === "Enter" && toggleExpanded()}
      aria-expanded={isExpanded}
    >
      <div
        class="w-full flex items-center justify-between border-b-2 border-black pb-2 transition-all duration-200"
      >
        <div class="flex items-center">
          <h2 class="text-xl font-bold text-black mr-2">Personal Growth</h2>
        </div>
        <div
          class="transform transition-transform duration-200 {isExpanded
            ? 'rotate-180'
            : ''}"
        >
          <ChevronDown class="h-5 w-5 text-black" />
        </div>
      </div>
    </button>
  
    {#if isExpanded}
      <div class="flow-root">
        <ul class="divide-y divide-gray-100">
          <!-- Example Growth Items - In real implementation, these would be populated from cvData -->
          {#each cvData?.cv_data?.personal_growth || [] as growth, index}
            <li
              class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200"
            >
              <!-- Black dot -->
              <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
  
              {#if editingIndex === index}
                <div class="space-y-4">
                  <!-- Edit Form -->
                  <div class="space-y-2">
                    <label
                      for={`area-of-focus-${index}`}
                      class="block text-sm font-medium">Area of Focus</label
                    >
                    <input
                      id={`area-of-focus-${index}`}
                      type="text"
                      bind:value={editFormData.area_of_focus}
                      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
  
                  <div class="space-y-2">
                    <label
                      for={`activity-method-${index}`}
                      class="block text-sm font-medium">Activity/Method</label
                    >
                    <input
                      id={`activity-method-${index}`}
                      type="text"
                      bind:value={editFormData.activity_method}
                      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
  
                  <div class="space-y-2">
                    <label
                      for={`description-${index}`}
                      class="block text-sm font-medium">Description/Key Learnings</label
                    >
                    <textarea
                      id={`description-${index}`}
                      rows="3"
                      bind:value={editFormData.description}
                      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    ></textarea>
                  </div>
  
                  <div class="space-y-2">
                    <label
                      for={`timeframe-${index}`}
                      class="block text-sm font-medium">Timeframe</label
                    >
                    <input
                      id={`timeframe-${index}`}
                      type="text"
                      bind:value={editFormData.timeframe}
                      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium">Skills Gained/Improved</label>
                    <div class="flex flex-wrap gap-2">
                      {#each defaultSkills as skill}
                        <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                          <input 
                            type="checkbox" 
                            id={`skill-${index}-${skill}`} 
                            class="mr-2" 
                            checked={editFormData.skills_gained.includes(skill)}
                            onchange={() => toggleSkillInEdit(skill)}
                          />
                          <label for={`skill-${index}-${skill}`}>{skill}</label>
                        </div>
                      {/each}
                    </div>
                    <div class="flex items-center mt-2">
                      <input
                        type="text"
                        placeholder="Add custom skill..."
                        bind:value={editCustomSkill}
                        class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                      />
                      <button
                        type="button"
                        onclick={addCustomSkillToEdit}
                        class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
  
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      onclick={() => handleUpdateExistingGrowth(index)}
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
                    <p class="text-lg font-semibold">{growth.area_of_focus}</p>
                    <div class="flex items-center">
                      <div class="flex space-x-1">
                        <button
                          onclick={() => handleEditClick(index)}
                          class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Edit growth item"
                          type="button"
                        >
                          <Pencil
                            class="h-4 w-4 text-gray-500 hover:text-black"
                          />
                        </button>
                        <button
                          onclick={() => handleDeleteGrowth(index)}
                          class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Delete growth item"
                          type="button"
                        >
                          <Trash2
                            class="h-4 w-4 text-gray-500 hover:text-black"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="text-base font-medium">{growth.activity_method}</p>
                  <p class="text-sm text-gray-600">{growth.timeframe}</p>
                  <p class="text-base text-gray-700 mt-1">{growth.description}</p>
                  <div class="flex flex-wrap gap-1 mt-2">
                    {#each growth.skills_gained as skill}
                      <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {skill}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}
            </li>
          {/each}
  
          <!-- Add New Growth Item -->
          <li
            class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200"
          >
            <span
              class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black flex items-center justify-center"
            >
              <Plus class="h-2 w-2 text-white" />
            </span>
  
            {#if isAddingNew}
              <div class="space-y-4">
                <!-- Add New Form -->
                <div class="space-y-2">
                  <label
                    for="new-area-of-focus"
                    class="block text-sm font-medium">Area of Focus</label
                  >
                  <input
                    id="new-area-of-focus"
                    type="text"
                    placeholder="e.g., Leadership, Technical Skill, Communication"
                    bind:value={newPersonalGrowth.area_of_focus}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
  
                <div class="space-y-2">
                  <label
                    for="new-activity-method"
                    class="block text-sm font-medium">Activity/Method</label
                  >
                  <input
                    id="new-activity-method"
                    type="text"
                    placeholder="e.g., Online Course, Workshop, Self-Directed Project"
                    bind:value={newPersonalGrowth.activity_method}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
  
                <div class="space-y-2">
                  <label
                    for="new-description"
                    class="block text-sm font-medium">Description/Key Learnings</label
                  >
                  <textarea
                    id="new-description"
                    rows="3"
                    placeholder="Brief narrative on what was done and learned, or the impact it had"
                    bind:value={newPersonalGrowth.description}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>
  
                <div class="space-y-2">
                  <label
                    for="new-timeframe"
                    class="block text-sm font-medium">Timeframe</label
                  >
                  <input
                    id="new-timeframe"
                    type="text"
                    placeholder="e.g., Jan 2024 - Present, Q3 2024, Ongoing"
                    bind:value={newPersonalGrowth.timeframe}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
  
                <div class="space-y-2">
                  <label class="block text-sm font-medium">Skills Gained/Improved</label>
                  <div class="flex flex-wrap gap-2">
                    {#each defaultSkills as skill}
                      <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                        <input 
                          type="checkbox" 
                          id={`new-skill-${skill}`} 
                          class="mr-2" 
                          checked={newPersonalGrowth.skills_gained.includes(skill)}
                          onchange={() => toggleSkillInNew(skill)}
                        />
                        <label for={`new-skill-${skill}`}>{skill}</label>
                      </div>
                    {/each}
                  </div>
                  <div class="flex items-center mt-2">
                    <input
                      type="text"
                      placeholder="Add custom skill..."
                      bind:value={newCustomSkill}
                      class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      onclick={addCustomSkillToNew}
                      class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
  
                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={handleSaveNewPersonalGrowth}
                    class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                  >
                    Add Growth Item
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
                Add growth item
              </button>
            {/if}
          </li>
        </ul>
      </div>
    {/if}
  </div>