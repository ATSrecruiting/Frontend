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
      <h2 class="text-xl font-bold text-white">Certifications</h2>
    </div>
  </button>

  {#if isExpanded}
    <div class="flow-root ml-3">
      <ul class="divide-y divide-gray-200">
        {#each cvData?.cv_data?.certifications || [] as cert, index}
          <li class="relative border-l border-gray-200 py-4 pl-8">
            <span
              class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600"
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
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
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
                    class="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div class="flex space-x-2">
                  <button
                    type="button"
                    onclick={() => handleUpdateCertification(index)}
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
                  <p class="text-lg font-semibold">{cert.certification_name}</p>
                  <div class="flex items-center">
                    <div class="flex space-x-1">
                      <button
                        onclick={() => handleEditClick(index, cert)}
                        class="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Edit certification"
                        type="button"
                      >
                        <Pencil class="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onclick={() => handleDeleteCertification(index)}
                        class="p-1 rounded-full hover:bg-gray-100 hover:text-red-500"
                        aria-label="Delete certification"
                        type="button"
                      >
                        <Trash2
                          class="h-4 w-4 text-gray-500 hover:text-red-500"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-base text-gray-500">{cert.certifier}</p>
              </div>
            {/if}
          </li>
        {/each}

        <li class="relative border-l border-gray-200 py-4 pl-8">
          <span
            class="absolute -left-1.5 top-6 h-3 w-3 rounded-full bg-red-600 flex items-center justify-center"
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
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
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
                  class="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div class="flex space-x-2">
                <button
                  type="button"
                  onclick={handleSaveNewCertification}
                  class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                >
                  Add Certification
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
              Add certification
            </button>
          {/if}
        </li>
      </ul>
    </div>
  {/if}
</div>
