<script lang="ts">
    import { loginUser } from "$lib/services/login";
    import { goto } from "$app/navigation";

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Separator } from "$lib/components/ui/separator";
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
                expiryTime.setHours(expiryTime.getHours() + 1);
                localStorage.setItem("token_expiry", expiryTime.toISOString());

                // Navigate to dashboard or home page
                if (result.account_type === "recruiter") {
                    goto("/dashboard");
                } else if (result.account_type === "candidate") {
                    goto("/dashboard"); // Fallback navigation
                }
            } else {
                error_message = "Login failed. Please try again.";
            }
        } catch (err) {
            error_message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
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
                    <!-- Replace with your actual logo -->
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
                        e.preventDefault();
                        handleSubmit(e);
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
                            class="text-sm text-muted-foreground"
                            >Remember me for 30 days</Label
                        >
                    </div>

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

                <div
                    class="my-6 flex items-center w-full max-w-full overflow-hidden px-2"
                >
                    <Separator class="flex-1 max-w-[40%]" />
                    <span
                        class="px-4 text-sm text-muted-foreground flex-shrink-0 whitespace-nowrap"
                        >Or continue with</span
                    >
                    <Separator class="flex-1 max-w-[40%]" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <Button variant="outline" class="w-full">
                        <svg
                            class="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        class="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2]"
                    >
                        <svg
                            class="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            />
                        </svg>
                        Facebook
                    </Button>
                </div>
            </CardContent>

            <CardFooter class="bg-muted/50 flex justify-center py-4">
                <p class="text-sm text-muted-foreground">
                    Don't have an account?
                    <a
                        href="/signup"
                        class="font-medium text-primary hover:text-primary/80"
                        >Sign up</a
                    >
                </p>
            </CardFooter>
        </Card>

        <p class="mt-4 text-center text-xs text-muted-foreground">
            © 2025 Your Company. All rights reserved.
        </p>
    </div>
</div>
