<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { onMount, tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import { getOpenRouterModels } from "$lib/services/llmModels";
  import type { ListOpenRouterModelsResponse } from "$lib/types/llm-models";

  async function LoadAllModels() {
    const response = await getOpenRouterModels();
    models = response;
  }

  onMount(() => {
    LoadAllModels();
  });

  let { setSelectedModel } = $props<{
    setSelectedModel: (modelName: string) => void;
  }>();

  let models = $state<ListOpenRouterModelsResponse[]>([]);

  let open = $state(false);
  let id = $state<number>();
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedid = $derived(models.find((f) => f.id === id)?.name);

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-[200px] justify-between"
        role="combobox"
        aria-expanded={open}
      >
        {selectedid || "Select a Model"}
        <ChevronsUpDownIcon class="opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group id="frameworks">
          {#each models as model (model.id)}
            <Command.Item
              id={model.id.toString()}
              onSelect={() => {
                id = model.id;
                setSelectedModel(model.model_name);
                closeAndFocusTrigger();
              }}
            >
              <CheckIcon class={cn(id !== model.id && "text-transparent")} />
              {model.name}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
