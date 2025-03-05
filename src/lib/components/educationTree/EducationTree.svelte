<script lang="ts">
  import { Pencil, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-svelte';
  import type { Education } from '$lib/types/uploadResume';
  import type { UploadResumeApiResponse } from '$lib/types/uploadResume';

  let { cvData } = $props<{ cvData: UploadResumeApiResponse | null }>();

  let editingIndex = $state(-1);
  let isExpanded = $state(true);
  let isAddingNew = $state(false);
  
  let editFormData = $state<Education>({
    degree: "",
    major: "",
    school: "",
    graduation_date: null
  });
  
  let newEducation = $state<Education>({
    degree: "",
    major: "",
    school: "",
    graduation_date: null
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
      graduation_date: null
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
    if (confirm('Are you sure you want to delete this education entry?')) {
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
  <button 
    type="button"
    class="flex items-center mb-4 w-full text-left"
    onclick={toggleExpanded}
    onkeydown={e => e.key === 'Enter' && toggleExpanded()}
    aria-expanded={isExpanded}
  >
    <div class="rounded-full bg-red-600 py-2 px-4 flex items-center z-10">
      {#if isExpanded}
        <ChevronDown class="h-4 w-4 text-white mr-2" />
      {:else}
        <ChevronRight class="h-4 w-4 text-white mr-2" />
      {/if}
      <h2 class="text-xl font-bold text-white">Education</h2>
    </div>
  </button>

  {#if isExpanded}
    <div class="flow-root ml-3">
      <ul class="divide-y divide-gray-200">
        {#each cvData?.cv_data?.education || [] as edu, index}
          <li class="relative border-l border-gray-200 py-4 pl-8">
            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600"></span>
            
            {#if editingIndex === index}
              <div class="space-y-4">
                <div class="space-y-2">
                  <label for={`degree-${index}`} class="block text-sm font-medium">Degree</label>
                  <input
                    id={`degree-${index}`}
                    type="text"
                    name="degree"
                    bind:value={editFormData.degree}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for={`major-${index}`} class="block text-sm font-medium">Major</label>
                  <input
                    id={`major-${index}`}
                    type="text"
                    name="major"
                    bind:value={editFormData.major}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for={`school-${index}`} class="block text-sm font-medium">School</label>
                  <input
                    id={`school-${index}`}
                    type="text"
                    name="school"
                    bind:value={editFormData.school}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for={`graduation-date-${index}`} class="block text-sm font-medium">Graduation Date</label>
                  <input
                    id={`graduation-date-${index}`}
                    type="text"
                    name="graduation_date"
                    bind:value={editFormData.graduation_date}
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    type="button" 
                    onclick={() => handleUpdateEducation(index)}
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
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <p class="text-lg font-semibold">{edu.school}</p>
                  <div class="flex items-center">
                    <p class="text-sm text-gray-500 mr-2">
                      {edu.graduation_date ?? 'In Progress'}
                    </p>
                    <div class="flex space-x-1">
                      <button 
                        onclick={() => handleEditClick(index, edu)}
                        class="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Edit education"
                        type="button"
                      >
                        <Pencil class="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onclick={() => handleDeleteEducation(index)}
                        class="p-1 rounded-full hover:bg-gray-100 hover:text-red-500"
                        aria-label="Delete education"
                        type="button"
                      >
                        <Trash2 class="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-base text-gray-500">{edu.degree}</p>
                <p class="text-base text-gray-500">{edu.major}</p>
              </div>
            {/if}
          </li>
        {/each}
        
        <li class="relative border-l border-gray-200 py-4 pl-8">
          <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600 flex items-center justify-center">
            <Plus class="h-2 w-2 text-white" />
          </span>
          
          {#if isAddingNew}
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="new-degree" class="block text-sm font-medium">Degree</label>
                <input
                  id="new-degree"
                  type="text"
                  name="degree"
                  bind:value={newEducation.degree}
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div class="space-y-2">
                <label for="new-major" class="block text-sm font-medium">Major</label>
                <input
                  id="new-major"
                  type="text"
                  name="major"
                  bind:value={newEducation.major}
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div class="space-y-2">
                <label for="new-school" class="block text-sm font-medium">School</label>
                <input
                  id="new-school"
                  type="text"
                  name="school"
                  bind:value={newEducation.school}
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div class="space-y-2">
                <label for="new-graduation-date" class="block text-sm font-medium">Graduation Date</label>
                <input
                  id="new-graduation-date"
                  type="text"
                  name="graduation_date"
                  bind:value={newEducation.graduation_date}
                  placeholder="Leave empty if in progress"
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div class="flex space-x-2">
                <button 
                  type="button" 
                  onclick={handleSaveNewEducation}
                  class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                >
                  Add Education
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
              Add education
            </button>
          {/if}
        </li>
      </ul>
    </div>
  {/if}
</div>