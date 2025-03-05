<script lang="ts">
  // Define props
  let { 
    value, 
    id = "custom-dropzone", 
    acceptedFileTypes = "image/*,.pdf,.txt,.docx",
    maxFileSize = 5242880  // 5MB default
  } = $props<{ 
    value: File[]; 
    id?: string; 
    acceptedFileTypes?: string; 
    maxFileSize?: number; 
  }>();
  
  // State variables
  let isDragging = $state(false);
  let inputElement: HTMLInputElement;
  
  // Event handlers
  const handleDragEnter = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    isDragging = true;
  };
  
  const handleDragLeave = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    isDragging = false;
  };
  
  const handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    isDragging = true;
  };
  
  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    isDragging = false;
    
    value = [];
    if (event.dataTransfer?.items) {
      [...event.dataTransfer.items].forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            value.push(file);
            value = value;
          }
        }
      });
    } else if (event.dataTransfer?.files) {
      [...event.dataTransfer.files].forEach((file) => {
        value.push(file);
        value = value;
      });
    }
  };
  
  const handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      value.push(files[0]);
      value = value;
    }
  };
  
  const showFiles = (files: File[]): string => {
    if (files.length === 1) return files[0].name;
    let concat = "";
    files.map((file) => {
      concat += file.name;
      concat += ",";
      concat += " ";
    });

    if (concat.length > 40) concat = concat.slice(0, 40);
    concat += "...";
    return concat;
  };
  
  const handleClick = () => {
    inputElement?.click();
  };
</script>

<div
  class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer {isDragging ? 'border-primary-600 bg-gray-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}"
  ondrop={handleDrop}
  ondragover={handleDragOver}
  ondragenter={handleDragEnter}
  ondragleave={handleDragLeave}
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
  aria-label="Dropzone"
  {id}
>
  <input
    type="file"
    class="hidden"
    bind:this={inputElement}
    onchange={handleChange}
    accept={acceptedFileTypes}
  />
  
  <div class="flex flex-col items-center justify-center pt-5 pb-6">
    <svg
      aria-hidden="true"
      class="mb-3 w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
    
    {#if value.length === 0}
      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span class="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        pdf, docs, txt (MAX. 800x400px)
      </p>
    {:else}
      <p class="text-sm text-gray-500 dark:text-gray-400">{showFiles(value)}</p>
    {/if}
  </div>
</div>