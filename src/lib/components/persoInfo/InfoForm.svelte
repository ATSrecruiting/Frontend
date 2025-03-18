<script lang="ts">
  import type { SubmitResumeApiRequest } from "$lib/types/submitResume";
  import type { Writable } from "svelte/store";

  let { cvData } = $props<{ cvData: SubmitResumeApiRequest | null }>();

  // Initialize default values if $cvData is null
  let data = $derived(
    cvData?.cv_data || {
      first_name: "",
      last_name: "",
      job_title: "",
      years_of_experience: 0,
      phone_number: "",
      address: { country: "", street: "" },
      email: "",
    },
  );
</script>

<h2 class="mb-6 text-center text-xl font-bold text-red-600">
  Personal Information
</h2>

<form class="space-y-4">
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <label for="first_name" class="mb-1 block"> First name </label>
      <input
        type="text"
        id="first_name"
        name="first_name"
        bind:value={data.first_name}
        class="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="last_name" class="mb-1 block"> Last name </label>
      <input
        type="text"
        id="last_name"
        name="last_name"
        bind:value={data.last_name}
        class="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="job_title" class="mb-1 block"> Job Title </label>
      <input
        type="text"
        id="job_title"
        name="job_title"
        bind:value={data.job_title}
        class="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="experience" class="mb-1 block"> Years of Experience </label>
      <input
        type="number"
        id="experience"
        name="years_of_experience"
        step="0.1"
        bind:value={data.years_of_experience}
        class="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="phone" class="mb-1 block"> Phone number </label>
      <input
        type="tel"
        id="phone"
        name="phone_number"
        bind:value={data.phone_number}
        class="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="country" class="mb-1 block"> Country </label>
      <input
        type="text"
        id="country"
        name="address[country]"
        required
        bind:value={data.address.country}
      />
    </div>
  </div>
  <div>
    <label for="street" class="mb-1 block"> Street Address </label>
    <input
      type="text"
      id="street"
      name="address[street]"
      bind:value={data.address.street}
      class="w-full rounded-md border border-gray-300 px-3 py-2"
    />
  </div>
  <div>
    <label for="email" class="mb-1 block"> Email address </label>
    <input
      type="email"
      id="email"
      name="email"
      bind:value={data.email}
      required
      class="w-full rounded-md border border-gray-300 px-3 py-2"
    />
  </div>
</form>
