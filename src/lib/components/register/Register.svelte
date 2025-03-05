<script lang="ts">
  import { registerUser } from "$lib/services/register";


  let is_loading = $state(false);

  let { navigate } = $props<{ navigate: (userId: number) => void }>();

let email = $state("");
let username = $state("");
let password = $state("");
let confirmPassword = $state("");

async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    is_loading = true;
    try {
        const response = await registerUser({ email, username, password });
        if (response.success) {
            console.log("Registration successful:", response.data);
            navigate(response.data?.user_id);
        } else {
            throw new Error(response.error || "Registration failed");
        }
    } catch (error) {
        alert(error instanceof Error ? error.message : "Registration failed");
    } finally {
        is_loading = false;
    }
}
</script>

<form
  onsubmit={handleSubmit}
  class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
>
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
    Create Account
  </h2>

  <div class="mb-5">
    <label
      for="username"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Username</label
    >
    <input
      type="text"
      id="username"
      bind:value={username}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  </div>

  <div class="mb-5">
    <label
      for="email"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Email address</label
    >
    <input
      type="email"
      id="email"
      bind:value={email}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="name@company.com"
      required
    />
  </div>

  <div class="mb-5">
    <label
      for="password"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Password</label
    >
    <input
      type="password"
      id="password"
      bind:value={password}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  </div>

  <div class="mb-5">
    <label
      for="confirmPassword"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Confirm password</label
    >
    <input
      type="password"
      id="confirmPassword"
      bind:value={confirmPassword}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  </div>

  <button
    type="submit"
    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 flex items-center justify-center"
    disabled={is_loading}
  >
    {#if is_loading}
    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading...</span>
    {:else}
      Create Account
    {/if}
  </button>
</form>
