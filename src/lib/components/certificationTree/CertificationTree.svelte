<script lang="ts">
  import {
    Pencil,
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
  } from "lucide-svelte";
  import type { Certification } from "$lib/types/uploadResume";
  import type { SubmitResumeApiRequest } from "$lib/types/submitResume";

  let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();

  let editingIndex = $state(-1);
  let isExpanded = $state(true);
  let isAddingNew = $state(false);

  let editFormData = $state<Certification>({
    certifier: "",
    certification_name: "",
  });

  let newCertification = $state<Certification>({
    certifier: "",
    certification_name: "",
  });

  function handleEditClick(index: number, cert: Certification) {
    editingIndex = index;
    editFormData = { ...cert };
    isAddingNew = false;
  }

  function handleCancelEdit() {
    editingIndex = -1;
  }

  function handleUpdateCertification(index: number) {
    cvData.cv_data.certifications[index] = editFormData;
    editingIndex = -1;
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function handleAddClick() {
    newCertification = {
      certifier: "",
      certification_name: "",
    };
    isAddingNew = true;
    editingIndex = -1;
  }

  function handleCancelAdd() {
    isAddingNew = false;
  }

  function handleSaveNewCertification() {
    if (!cvData.cv_data.certifications) {
      cvData.cv_data.certifications = [];
    }
    cvData.cv_data.certifications.push({ ...newCertification });
    isAddingNew = false;
  }

  function handleDeleteCertification(index: number) {
    if (confirm("Are you sure you want to delete this certification?")) {
      cvData.cv_data.certifications.splice(index, 1);
      if (editingIndex === index) {
        editingIndex = -1;
      } else if (editingIndex > index) {
        editingIndex--;
      }
    }
  }
</script>

<div class="mt-6 relative">
  <!-- Improved header/dropdown button - same as education -->
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
        <h2 class="text-xl font-bold text-black mr-2">Certifications</h2>
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
        {#each cvData?.cv_data?.certifications || [] as cert, index}
          <li
            class="relative border-l-2 border-gray-200 py-4 pl-6 hover:border-black transition-colors duration-200"
          >
            <!-- Black dot instead of red -->
            <span class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-black"
            ></span>

            {#if editingIndex === index}
              <div class="space-y-4">
                <div class="space-y-2">
                  <label
                    for={`certification-name-${index}`}
                    class="block text-sm font-medium">Certification Name</label
                  >
                  <input
                    id={`certification-name-${index}`}
                    type="text"
                    name="certification_name"
                    bind:value={editFormData.certification_name}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for={`certifier-${index}`}
                    class="block text-sm font-medium">Certifier</label
                  >
                  <input
                    id={`certifier-${index}`}
                    type="text"
                    name="certifier"
                    bind:value={editFormData.certifier}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={() => handleUpdateCertification(index)}
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
                  <p class="text-lg font-semibold">{cert.certification_name}</p>
                  <div class="flex items-center">
                    <div class="flex space-x-1">
                      <button
                        onclick={() => handleEditClick(index, cert)}
                        class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Edit certification"
                        type="button"
                      >
                        <Pencil
                          class="h-4 w-4 text-gray-500 hover:text-black"
                        />
                      </button>
                      <button
                        onclick={() => handleDeleteCertification(index)}
                        class="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Delete certification"
                        type="button"
                      >
                        <Trash2
                          class="h-4 w-4 text-gray-500 hover:text-black"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-base text-gray-700">{cert.certifier}</p>
              </div>
            {/if}
          </li>
        {/each}

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
              <div class="space-y-2">
                <label
                  for="new-certification-name"
                  class="block text-sm font-medium">Certification Name</label
                >
                <input
                  id="new-certification-name"
                  type="text"
                  name="certification_name"
                  bind:value={newCertification.certification_name}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="space-y-2">
                <label for="new-certifier" class="block text-sm font-medium"
                  >Certifier</label
                >
                <input
                  id="new-certifier"
                  type="text"
                  name="certifier"
                  bind:value={newCertification.certifier}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div class="flex space-x-2">
                <button
                  type="button"
                  onclick={handleSaveNewCertification}
                  class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Add Certification
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
              Add certification
            </button>
          {/if}
        </li>
      </ul>
    </div>
  {/if}
</div>
