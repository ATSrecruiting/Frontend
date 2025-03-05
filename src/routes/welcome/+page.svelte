<script>
  import { goto } from "$app/navigation";

  function handleStart() {
    goto("/register");
  }
</script>

<div
  class="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16"
>
  <div class="mx-auto max-w-3xl space-y-8 text-center">
    <img
      src="https://dev.micla.info/wp-content/uploads/2020/05/logo_corporate.png"
      alt="MICLA Logo"
      class="mx-auto mb-8 max-w-[400px]"
    />
    <h1 class="mb-6 text-4xl font-bold text-primary md:text-5xl">
      Welcome to MICLA Design & Engineering
    </h1>
    <p class="mb-12 text-xl leading-relaxed text-gray-700">
      We're excited to learn more about your journey! Share with us your
      professional experience, including your career achievements, educational
      background, and the unique perspectives you bring to the field of design
      and engineering. Your experience matters to us, and we look forward to
      discovering how you could be part of our innovative team.
    </p>
    <button
      onclick={handleStart}
      class="transform rounded-lg bg-primary px-12 py-4 text-xl text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
    >
      Start Your Journey
    </button>
  </div>
</div>
