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
  
  let isExpanded = $state(true);

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  // Handle adding custom values
  let newCoreValue = $state("");
  let newWorkingStyle = $state("");
  let newInterest = $state("");

  function addCoreValue() {
    if (newCoreValue.trim()) {
      cvData.cv_data.who_am_i.core_values.push(newCoreValue.trim());
      newCoreValue = "";
    }
  }

  function addWorkingStyle() {
    if (newWorkingStyle.trim()) {
      cvData.cv_data.who_am_i.working_style.push(newWorkingStyle.trim());
      newWorkingStyle = "";
    }
  }

  function addInterest() {
    if (newInterest.trim()) {
      cvData.cv_data.who_am_i.interests_passions.push(newInterest.trim());
      newInterest = "";
    }
  }

  // Handle toggling predefined values
  function toggleCoreValue(value: string) {
    const index = cvData.cv_data.who_am_i.core_values.indexOf(value);
    if (index === -1) {
      cvData.cv_data.who_am_i.core_values.push(value);
    } else {
      cvData.cv_data.who_am_i.core_values.splice(index, 1);
    }
  }

  function toggleWorkingStyle(style: string) {
    const index = cvData.cv_data.who_am_i.working_style.indexOf(style);
    if (index === -1) {
      cvData.cv_data.who_am_i.working_style.push(style);
    } else {
      cvData.cv_data.who_am_i.working_style.splice(index, 1);
    }
  }

  function toggleMotivator(motivator: string) {
    const index = cvData.cv_data.who_am_i.motivators.indexOf(motivator);
    if (index === -1) {
      cvData.cv_data.who_am_i.motivators.push(motivator);
    } else {
      cvData.cv_data.who_am_i.motivators.splice(index, 1);
    }
  }

  function toggleInterest(interest: string) {
    const index = cvData.cv_data.who_am_i.interests_passions.indexOf(interest);
    if (index === -1) {
      cvData.cv_data.who_am_i.interests_passions.push(interest);
    } else {
      cvData.cv_data.who_am_i.interests_passions.splice(index, 1);
    }
  }

  // Predefined options
  const predefinedCoreValues = ['Integrity', 'Collaboration', 'Innovation', 'Continuous Learning', 'Impact'];
  const predefinedWorkingStyles = ['Collaborative', 'Independent', 'Fast-paced', 'Detail-oriented', 'Big-picture focused', 'Structured', 'Adaptable'];  
  const predefinedMotivators = ['Solving complex problems', 'Helping others', 'Learning new things', 'Achieving tangible results', 'Creative expression'];
  const predefinedInterests = ['Team sports', 'Mentoring', 'Open source contributions', 'Blogging about industry trends', 'Community volunteering'];
</script>

<div class="mt-6 relative">
  <!-- Header/dropdown button - same as other sections -->
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
        <h2 class="text-xl font-bold text-black mr-2">Who I Am</h2>
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
        <!-- Personal Statement -->
        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <p class="text-lg font-semibold">Personal Statement</p>
            </div>
            <div class="space-y-2">
              <textarea
                id="personal-statement"
                name="personal_statement"
                placeholder="A short narrative summary introducing yourself, your professional philosophy, or what you're passionate about..."
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                rows="3"
                bind:value={cvData.cv_data.who_am_i.personal_statement}
              ></textarea>
            </div>
          </div>
        </li>

        <!-- Core Values -->
        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <p class="text-lg font-semibold">Core Values</p>
            </div>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                {#each predefinedCoreValues as value}
                  <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <input 
                      type="checkbox" 
                      id={`value-${value}`} 
                      class="mr-2" 
                      checked={cvData.cv_data.who_am_i.core_values.includes(value)}
                      onchange={() => toggleCoreValue(value)} 
                    />
                    <label for={`value-${value}`}>{value}</label>
                  </div>
                {/each}
              </div>
              <div class="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Add custom value..."
                  class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  bind:value={newCoreValue}
                  onkeydown={(e) => e.key === "Enter" && addCoreValue()}
                />
                <button
                  type="button"
                  class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                  onclick={addCoreValue}
                >
                  Add
                </button>
              </div>
              {#if cvData.cv_data.who_am_i.core_values.filter((val: string) => !predefinedCoreValues.includes(val)).length > 0}
                <div class="mt-2">
                  <p class="text-sm font-medium text-gray-700 mb-1">Custom values:</p>
                  <div class="flex flex-wrap gap-2">
                    {#each cvData.cv_data.who_am_i.core_values.filter((val: string) => !predefinedCoreValues.includes(val)) as value}
                      <div class="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm">
                        {value}
                        <button 
                          type="button" 
                          class="ml-1 text-gray-500 hover:text-gray-700"
                          onclick={() => toggleCoreValue(value)}
                        >
                          <Trash2 class="h-3 w-3" />
                        </button>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </li>

        <!-- Working Style -->
        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <p class="text-lg font-semibold">Working Style</p>
            </div>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                {#each predefinedWorkingStyles as style}
                  <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <input 
                      type="checkbox" 
                      id={`style-${style}`} 
                      class="mr-2" 
                      checked={cvData.cv_data.who_am_i.working_style.includes(style)}
                      onchange={() => toggleWorkingStyle(style)} 
                    />
                    <label for={`style-${style}`}>{style}</label>
                  </div>
                {/each}
              </div>
              <div class="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Add custom working style..."
                  class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  bind:value={newWorkingStyle}
                  onkeydown={(e) => e.key === "Enter" && addWorkingStyle()}
                />
                <button
                  type="button"
                  class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                  onclick={addWorkingStyle}
                >
                  Add
                </button>
              </div>
              {#if cvData.cv_data.who_am_i.working_style.filter((val: string) => !predefinedWorkingStyles.includes(val)).length > 0}
                <div class="mt-2">
                  <p class="text-sm font-medium text-gray-700 mb-1">Custom working styles:</p>
                  <div class="flex flex-wrap gap-2">
                    {#each cvData.cv_data.who_am_i.working_style.filter((val: string) => !predefinedWorkingStyles.includes(val)) as style}
                      <div class="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm">
                        {style}
                        <button 
                          type="button" 
                          class="ml-1 text-gray-500 hover:text-gray-700"
                          onclick={() => toggleWorkingStyle(style)}
                        >
                          <Trash2 class="h-3 w-3" />
                        </button>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </li>

        <!-- Motivators -->
        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <p class="text-lg font-semibold">Motivators</p>
            </div>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                {#each predefinedMotivators as motivator}
                  <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <input 
                      type="checkbox" 
                      id={`motivator-${motivator}`} 
                      class="mr-2" 
                      checked={cvData.cv_data.who_am_i.motivators.includes(motivator)}
                      onchange={() => toggleMotivator(motivator)} 
                    />
                    <label for={`motivator-${motivator}`}>{motivator}</label>
                  </div>
                {/each}
              </div>
              <textarea
                id="custom-motivators"
                placeholder="Additional motivators..."
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                rows="2"
                onblur={(e) => {
                  const target = e.target as HTMLTextAreaElement | null;
                  if (target && target.value.trim()) {
                    const newMotivators = target.value.split(',').map(m => m.trim()).filter(Boolean);
                    cvData.cv_data.who_am_i.motivators = [
                      ...cvData.cv_data.who_am_i.motivators.filter((m: string) => predefinedMotivators.includes(m)),
                      ...newMotivators
                    ];
                    target.value = '';
                  }
                }}
              ></textarea>
              {#if cvData.cv_data.who_am_i.motivators.filter((val: string) => !predefinedMotivators.includes(val)).length > 0}
                <div class="mt-2">
                  <p class="text-sm font-medium text-gray-700 mb-1">Custom motivators:</p>
                  <div class="flex flex-wrap gap-2">
                    {#each cvData.cv_data.who_am_i.motivators.filter((val: string) => !predefinedMotivators.includes(val)) as motivator}
                      <div class="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm">
                        {motivator}
                        <button 
                          type="button" 
                          class="ml-1 text-gray-500 hover:text-gray-700"
                          onclick={() => toggleMotivator(motivator)}
                        >
                          <Trash2 class="h-3 w-3" />
                        </button>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </li>

        <!-- Interests/Passions -->
        <li class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200">
          <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"></span>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <p class="text-lg font-semibold">Interests/Passions</p>
            </div>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                {#each predefinedInterests as interest}
                  <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <input 
                      type="checkbox" 
                      id={`interest-${interest}`} 
                      class="mr-2" 
                      checked={cvData.cv_data.who_am_i.interests_passions.includes(interest)}
                      onchange={() => toggleInterest(interest)} 
                    />
                    <label for={`interest-${interest}`}>{interest}</label>
                  </div>
                {/each}
              </div>
              <div class="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Add custom interest..."
                  class="rounded-l-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  bind:value={newInterest}
                  onkeydown={(e) => e.key === "Enter" && addInterest()}
                />
                <button
                  type="button"
                  class="rounded-r-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                  onclick={addInterest}
                >
                  Add
                </button>
              </div>
              {#if cvData.cv_data.who_am_i.interests_passions.filter((val: string) => !predefinedInterests.includes(val)).length > 0}
                <div class="mt-2">
                  <p class="text-sm font-medium text-gray-700 mb-1">Custom interests:</p>
                  <div class="flex flex-wrap gap-2">
                    {#each cvData.cv_data.who_am_i.interests_passions.filter((val: string) => !predefinedInterests.includes(val)) as interest}
                      <div class="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm">
                        {interest}
                        <button 
                          type="button" 
                          class="ml-1 text-gray-500 hover:text-gray-700"
                          onclick={() => toggleInterest(interest)}
                        >
                          <Trash2 class="h-3 w-3" />
                        </button>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </li>
      </ul>
    </div>
  {/if}
</div>