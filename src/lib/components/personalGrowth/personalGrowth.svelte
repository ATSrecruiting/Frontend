<script lang="ts">
    import {
      Pencil,
      ChevronDown,
      ChevronRight,
      Plus,
      Trash2
    } from "lucide-svelte";
    import type { SubmitResumeApiRequest } from "$lib/types/submitResume";
  
    let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();
    
    let editingIndex = $state(-1);
    let isExpanded = $state(true);
    let isAddingNew = $state(false);
  
    function toggleExpanded() {
      isExpanded = !isExpanded;
    }
  
    function handleAddClick() {
      isAddingNew = true;
      editingIndex = -1;
    }
  
    function handleCancelAdd() {
      isAddingNew = false;
    }
  
    function handleEditClick(index: number) {
      editingIndex = index;
      isAddingNew = false;
    }
  
    function handleCancelEdit() {
      editingIndex = -1;
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
          {#each [{
            area_of_focus: "Public Speaking",
            activity_method: "Joined Toastmasters club & completed 5 speeches",
            description: "Overcame significant anxiety presenting to groups. Learned structuring arguments effectively and engaging an audience. Received positive feedback on clarity.",
            timeframe: "Jan 2024 - Present",
            skills_gained: ["Public Speaking", "Confidence", "Communication"]
          }, {
            area_of_focus: "Leadership",
            activity_method: "Led volunteer project with 10 team members",
            description: "Organized community cleanup initiative, coordinated team schedules, and delegated responsibilities to maximize impact.",
            timeframe: "Summer 2024",
            skills_gained: ["Leadership", "Organization", "Team Management"]
          }] as growth, index}
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
                      value={growth.area_of_focus}
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
                      value={growth.activity_method}
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
                      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    >{growth.description}</textarea>
                  </div>
  
                  <div class="space-y-2">
                    <label
                      for={`timeframe-${index}`}
                      class="block text-sm font-medium">Timeframe</label
                    >
                    <input
                      id={`timeframe-${index}`}
                      type="text"
                      value={growth.timeframe}
                      class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium">Skills Gained/Improved</label>
                    <div class="flex flex-wrap gap-2">
                      {#each ['Leadership', 'Communication', 'Problem Solving', 'Technical Skills', 'Creativity', 'Teamwork', 'Public Speaking', 'Confidence', 'Organization', 'Team Management'] as skill}
                        <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                          <input 
                            type="checkbox" 
                            id={`skill-${index}-${skill}`} 
                            class="mr-2" 
                            checked={growth.skills_gained.includes(skill)}
                          />
                          <label for={`skill-${index}-${skill}`}>{skill}</label>
                        </div>
                      {/each}
                    </div>
                    <div class="flex items-center mt-2">
                      <input
                        type="text"
                        placeholder="Add custom skill..."
                        class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                      />
                      <button
                        type="button"
                        class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
  
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      onclick={() => {/* Save logic would go here */; handleCancelEdit();}}
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
                          onclick={() => {/* Delete logic would go here */}}
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
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
  
                <div class="space-y-2">
                  <label class="block text-sm font-medium">Skills Gained/Improved</label>
                  <div class="flex flex-wrap gap-2">
                    {#each ['Leadership', 'Communication', 'Problem Solving', 'Technical Skills', 'Creativity', 'Teamwork', 'Public Speaking', 'Confidence', 'Organization', 'Team Management'] as skill}
                      <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                        <input type="checkbox" id={`new-skill-${skill}`} class="mr-2" />
                        <label for={`new-skill-${skill}`}>{skill}</label>
                      </div>
                    {/each}
                  </div>
                  <div class="flex items-center mt-2">
                    <input
                      type="text"
                      placeholder="Add custom skill..."
                      class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
  
                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={() => {/* Save new logic would go here */; handleCancelAdd();}}
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