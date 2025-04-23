<script lang="ts">
    import { loginUser } from "$lib/services/login";
    import { goto } from "$app/navigation";

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Checkbox } from "$lib/components/ui/checkbox";
    // Separator is no longer needed if we remove the social logins section
    // import { Separator } from "$lib/components/ui/separator";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";

    let isLoading = $state(false);
    let error_message = $state("");
    let rememberMe = $state(false);

    let email = $state("");
    let password = $state("");

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isLoading = true;
        error_message = "";

        try {
            const result = await loginUser({ email, password });

            if (result.access_token) {
                // Store tokens in localStorage
                localStorage.setItem("access_token", result.access_token);

                const expiryTime = new Date();
                expiryTime.setHours(expiryTime.getHours() + 1); // Example: 1 hour expiry
                localStorage.setItem("token_expiry", expiryTime.toISOString());

                // Navigate based on account type
                if (result.account_type === "recruiter" || result.account_type === "candidate") {
                    goto("/dashboard"); // Navigate both types to dashboard
                } else {
                    goto("/dashboard"); // Default fallback navigation
                }
            } else {
                error_message = "Login failed. Please check your credentials and try again.";
            }
        } catch (err) {
            error_message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred during login.";
        } finally {
            isLoading = false;
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
                <CardTitle class="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription class="text-primary-foreground/80"
                    >Sign in to your account</CardDescription
                >
            </CardHeader>

            <CardContent class="pt-6">
                <form
                    onsubmit={(e) => {
                        e.preventDefault(); // Keep default prevention
                        handleSubmit(e);    // Call the async handler
                    }}
                    class="space-y-4"
                >
                    <div class="space-y-2">
                        <Label for="email">Email Address</Label>
                        <div class="relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                                    />
                                    <path
                                        d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                                    />
                                </svg>
                            </div>
                            <Input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                bind:value={email}
                                class="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <Label for="password">Password</Label>
                            <a
                                href="/forgot-password"
                                class="text-sm text-primary hover:text-primary/80 font-medium"
                                >Forgot password?</a
                            >
                        </div>
                        <div class="relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                bind:value={password}
                                class="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div class="flex items-center space-x-2">
                        <Checkbox id="remember-me" bind:checked={rememberMe} />
                        <Label
                            for="remember-me"
                            class="text-sm text-muted-foreground select-none"  
                            >Remember me</Label 
                        > 
                    </div>

                    {#if error_message}
                        <p class="text-sm text-destructive text-center">{error_message}</p>
                    {/if}

                    <Button
                        type="submit"
                        class="w-full"
                        variant="default"
                        disabled={isLoading}
                    >
                        {#if isLoading}
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
                            Signing in...
                        {:else}
                            Sign in
                        {/if}
                    </Button>
                </form>

                </CardContent>

            <CardFooter class="bg-muted/50 flex justify-center py-4 mt-6"> 
                <p class="text-sm text-muted-foreground">
                    Don't have an account?
                    <a
                        href="/register"
                        class="font-medium text-primary hover:text-primary/80"
                        >Sign up</a
                    >
                </p>
            </CardFooter>
        </Card>

        <p class="mt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Your Company. All rights reserved. 
        </p>
    </div>
</div>