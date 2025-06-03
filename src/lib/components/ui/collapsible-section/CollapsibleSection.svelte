<script lang="ts">
    import { ChevronDown } from "lucide-svelte";
    import type { Component } from "svelte";

    let { 
        title, 
        icon, 
        initiallyExpanded = false,
        children
    } = $props<{
        title: string;
        icon?: Component;
        initiallyExpanded?: boolean;
        children: any;
    }>();

    let expanded = $state(initiallyExpanded);

    function toggle() {
        expanded = !expanded;
    }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <button
        type="button"
        class="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors"
        onclick={toggle}
    >
        <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            {#if icon}
                {@const IconComponent = icon}
                <IconComponent class="h-5 w-5 mr-2" />
            {/if}
            {title}
        </h2>
        <ChevronDown
            class="h-5 w-5 text-gray-500 transform transition-transform {expanded ? 'rotate-180' : ''}"
        />
    </button>

    {#if expanded}
        <div class="p-6">
            {@render children()}
        </div>
    {/if}
</div>