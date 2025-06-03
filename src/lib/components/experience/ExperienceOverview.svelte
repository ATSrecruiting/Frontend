<script lang="ts">
    import { Calendar, MapPin, Building, Briefcase } from "lucide-svelte";
    import SkillTag from "$lib/components/ui/skill-tag/SkillTag.svelte";
    import type {GetCandidateWorkExperienceResponse as Experience} from "$lib/types/candidates";
    import { getCandidateWorkExperience } from "$lib/services/candidates";
    import { onMount } from "svelte";



    let {experience} = $props<{
        experience: Experience;
    }>();


 
</script>

<!-- Experience Overview -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
    <div class="p-8">
        <div class="flex items-start justify-between mb-6">
            <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    {experience.title}
                </h1>
                <div class="flex items-center space-x-6 text-gray-600 mb-4">
                    <div class="flex items-center">
                        <Building class="h-5 w-5 mr-2" />
                        <span class="text-lg font-semibold">{experience.company}</span>
                    </div>
                    <div class="flex items-center">
                        <MapPin class="h-5 w-5 mr-2" />
                        <span>{experience.location}</span>
                    </div>
                    <div class="flex items-center">
                        <Calendar class="h-5 w-5 mr-2" />
                        <span>{experience.start_date} - {experience.end_date}</span>
                    </div>
                </div>
                <div class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <Briefcase class="h-4 w-4 mr-1" />
                    {experience.employment_type}
                </div>
            </div>
        </div>

        <!-- Skills -->
        <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                Skills & Technologies
            </h3>
            <div class="flex flex-wrap gap-2">
                {#each experience.skills ?? [] as skill}
                    <SkillTag {skill} />
                {/each}
            </div>
        </div>
    </div>
</div>