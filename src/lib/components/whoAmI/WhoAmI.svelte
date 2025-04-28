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
                  {#each ['Integrity', 'Collaboration', 'Innovation', 'Continuous Learning', 'Impact'] as value}
                    <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                      <input type="checkbox" id={`value-${value}`} class="mr-2" />
                      <label for={`value-${value}`}>{value}</label>
                    </div>
                  {/each}
                </div>
                <div class="flex items-center mt-2">
                  <input
                    type="text"
                    placeholder="Add custom value..."
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
                  {#each ['Collaborative', 'Independent', 'Fast-paced', 'Detail-oriented', 'Big-picture focused', 'Structured', 'Adaptable'] as style}
                    <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                      <input type="checkbox" id={`style-${style}`} class="mr-2" />
                      <label for={`style-${style}`}>{style}</label>
                    </div>
                  {/each}
                </div>
                <div class="flex items-center mt-2">
                  <input
                    type="text"
                    placeholder="Add custom working style..."
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
                  {#each ['Solving complex problems', 'Helping others', 'Learning new things', 'Achieving tangible results', 'Creative expression'] as motivator}
                    <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                      <input type="checkbox" id={`motivator-${motivator}`} class="mr-2" />
                      <label for={`motivator-${motivator}`}>{motivator}</label>
                    </div>
                  {/each}
                </div>
                <textarea
                  id="custom-motivators"
                  name="custom_motivators"
                  placeholder="Additional motivators..."
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  rows="2"
                ></textarea>
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
                  {#each ['Team sports', 'Mentoring', 'Open source contributions', 'Blogging about industry trends', 'Community volunteering'] as interest}
                    <div class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                      <input type="checkbox" id={`interest-${interest}`} class="mr-2" />
                      <label for={`interest-${interest}`}>{interest}</label>
                    </div>
                  {/each}
                </div>
                <div class="flex items-center mt-2">
                  <input
                    type="text"
                    placeholder="Add custom interest..."
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
            </div>
          </li>
        </ul>
      </div>
    {/if}
  </div>