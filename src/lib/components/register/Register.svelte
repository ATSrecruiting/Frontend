<script lang="ts">
  // Import the registration service function
  import { registerUser } from "$lib/services/register"; // Assuming this service exists

  // Import shadcn/ui components
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
      Card,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
  } from "$lib/components/ui/card";
  // Note: Separator is not needed as social logins were removed

  // Component State using Svelte 5 Runes
  let is_loading = $state(false);
  // Error messages are handled via alert() in this version

  // Component Props (using Svelte 5 Runes syntax for props)
  // Expects a 'navigate' function passed as a prop, which takes a user ID number
  let { navigate } = $props<{ navigate: (userId: number) => void }>();

  // Form fields state
  let email = $state("");
  let username = $state("");
  let password = $state("");
  let confirmPassword = $state("");

  // Handle form submission (using the logic provided by the user)
  async function handleSubmit(event: SubmitEvent) {
      event.preventDefault(); // Prevent default form submission

      // Basic validation: Check if passwords match
      if (password !== confirmPassword) {
          // Using alert for error message as per the provided logic
          alert("Passwords do not match");
          return; // Stop submission if passwords don't match
      }

      // Set loading state
      is_loading = true;

      try {
          // Call the registration service function
          const response = await registerUser({ email, username, password });

          // Check if the registration was successful based on the service response structure
          if (response.success && response.data?.user_id) {
              console.log("Registration successful:", response.data); // Optional: Log success data
              // Call the navigate prop function with the user ID
              navigate(response.data.user_id);
          } else {
              // Throw an error if registration failed or user_id is missing
              throw new Error(response.error || "Registration failed: Missing user ID in response.");
          }
      } catch (error) {
          // Handle errors during registration using alert
          alert(error instanceof Error ? error.message : "Registration failed");
      } finally {
          // Ensure loading state is reset regardless of success or failure
          is_loading = false;
      }
  }
</script>

<div
  class="min-h-screen bg-gradient-to-br from-background/50 to-background flex items-center justify-center p-4"
>
  <div class="w-full max-w-md">
      <Card class="border-border/40 shadow-lg">
          <CardHeader
              class="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground text-center space-y-2 pb-6"
          >
              <div class="flex justify-center mb-2">
                  <div
                      class="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center"
                  >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                          <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                      </svg>
                  </div>
              </div>
              <CardTitle class="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription class="text-primary-foreground/80"
                  >Sign up to get started</CardDescription
              >
          </CardHeader>

          <CardContent class="pt-6">
               <form
                  onsubmit={handleSubmit}
                  class="space-y-4"
              >
                  <div class="space-y-2">
                      <Label for="username">Username</Label>
                      <div class="relative">
                           <Input
                              type="text"
                              id="username"
                              placeholder="johndoe"
                              bind:value={username}
                              required
                              class="pl-3" />
                      </div>
                  </div>

                  <div class="space-y-2">
                      <Label for="email">Email Address</Label>
                      <div class="relative">
                           <Input
                              type="email"
                              id="email"
                              placeholder="you@example.com"
                              bind:value={email}
                              required
                              class="pl-3" />
                      </div>
                  </div>

                  <div class="space-y-2">
                      <Label for="password">Password</Label>
                      <div class="relative">
                           <Input
                              type="password"
                              id="password"
                              placeholder="••••••••"
                              bind:value={password}
                              required
                              minlength={8}
                              class="pl-3" />
                      </div>
                  </div>

                  <div class="space-y-2">
                      <Label for="confirmPassword">Confirm Password</Label>
                      <div class="relative">
                           <Input
                              type="password"
                              id="confirmPassword"
                              placeholder="••••••••"
                              bind:value={confirmPassword}
                              required
                              minlength={8}
                              class="pl-3" />
                      </div>
                  </div>

                  <Button
                      type="submit"
                      class="w-full"
                      variant="default"
                      disabled={is_loading}
                  >
                      {#if is_loading}
                          <svg
                              class="animate-spin -ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                          >
                              <circle
                                  class="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  stroke-width="4"
                              ></circle>
                              <path
                                  class="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                          </svg>
                          Creating account...
                      {:else}
                          Create Account
                      {/if}
                  </Button>
              </form>
          </CardContent>

          <CardFooter class="bg-muted/50 flex justify-center py-4 mt-6">
              <p class="text-sm text-muted-foreground">
                  Already have an account?
                  <a
                      href="/login"
                      class="font-medium text-primary hover:text-primary/80"
                      >Sign in</a
                  >
              </p>
          </CardFooter>
      </Card>

      <p class="mt-4 text-center text-xs text-muted-foreground">
           © {new Date().getFullYear()} Your Company. All rights reserved.
      </p>
  </div>
</div>
