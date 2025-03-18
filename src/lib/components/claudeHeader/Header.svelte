<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    // Define type for user profile
    type UserProfile = {
        name: string;
        email: string;
        avatar?: string;
    };

    // Props for customization with TypeScript types
    let {
        title = "Dashboard",
        userProfile = {
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "/profile-avatar.svg",
        },
    } = $props<{
        title?: string;
        userProfile?: UserProfile;
    }>();

    // State for dropdown menu
    let isProfileDropdownOpen = $state(false);
    let profileButton: HTMLElement;
    let profileDropdown = $state<HTMLElement | null>(null);

    // Toggle profile dropdown
    function toggleProfileDropdown(): void {
        isProfileDropdownOpen = !isProfileDropdownOpen;
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent): void {
        if (!profileButton || !profileDropdown) return;

        const target = event.target as Node;

        if (
            !profileDropdown.contains(target) &&
            !profileButton.contains(target)
        ) {
            isProfileDropdownOpen = false;
        }
    }

    // Handle keyboard interaction
    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            isProfileDropdownOpen = false;
        } else if (
            (event.key === "Enter" || event.key === " ") &&
            event.target === profileButton
        ) {
            event.preventDefault();
            toggleProfileDropdown();
        }
    }

    // Set up event listeners only in the browser
    onMount(() => {
        if (browser) {
            window.addEventListener("click", handleClickOutside);
            window.addEventListener("keydown", handleKeydown);

            return () => {
                window.removeEventListener("click", handleClickOutside);
                window.removeEventListener("keydown", handleKeydown);
            };
        }
    });
</script>

<header
    class="bg-black text-white h-16 flex items-center justify-between px-6 shadow-md border-b border-gray-700"
>
    <div class="flex items-center">
        <h1 class="text-xl font-semibold">{title}</h1>
    </div>

    <div class="relative">
        <button
            bind:this={profileButton}
            class="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            onclick={toggleProfileDropdown}
            aria-expanded={isProfileDropdownOpen}
            aria-controls="profile-dropdown"
            tabindex="0"
        >
            <div class="flex items-center space-x-3">
                <span class="text-sm hidden md:block">{userProfile.name}</span>
                <div
                    class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
                >
                    {#if userProfile.avatar}
                        <img
                            src={userProfile.avatar}
                            alt="Profile"
                            class="h-full w-full object-cover"
                        />
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    {/if}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </button>

        <!-- Profile Dropdown -->
        {#if isProfileDropdownOpen}
            <div
                bind:this={profileDropdown}
                class="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-10 border border-gray-700"
            >
                <div class="px-4 py-2 border-b border-gray-700">
                    <p class="text-sm font-semibold">{userProfile.name}</p>
                    <p class="text-xs text-gray-400 truncate">
                        {userProfile.email}
                    </p>
                </div>
                <a
                    href="/profile"
                    class="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors duration-200"
                    >Profile</a
                >
                <a
                    href="/settings"
                    class="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors duration-200"
                    >Settings</a
                >
                <div class="border-t border-gray-700">
                    <a
                        href="/logout"
                        class="block px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors duration-200"
                        >Sign out</a
                    >
                </div>
            </div>
        {/if}
    </div>
</header>
