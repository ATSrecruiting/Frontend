<script lang="ts">
    // Define types for navigation items
    type NavChildItem = {
        title: string;
        href: string;
    };

    type NavItem = {
        title: string;
        icon: "grid" | "bar-chart" | "settings" | "users" | "folder" | "info";
        href: string;
        children?: NavChildItem[];
    };

    // Create state for sidebar expansion
    let isExpanded = $state(true);

    // Props for customization with TypeScript types
    let {
        logoSrc = "/logo.svg",
        logoAlt = "Company Logo",
        footerText = "© 2025 Your Company",
    } = $props<{
        logoSrc?: string;
        logoAlt?: string;
        footerText?: string;
    }>();

    // Function to toggle sidebar with additional handling
    function toggleSidebar(): void {
        isExpanded = !isExpanded;

        // Close all dropdowns when collapsing sidebar
        if (!isExpanded) {
            // Reset all open dropdowns when sidebar collapses
            Object.keys(openDropdowns).forEach((key) => {
                openDropdowns[Number(key)] = false;
            });
        }
    }

    // Sample navigation items (replace with your actual items)
    const navItems = $state<NavItem[]>([
        {
            title: "Dashboard",
            icon: "grid",
            href: "/dashboard",
        },
        {
            title: "Analytics",
            icon: "bar-chart",
            href: "/analytics",
        },
        {
            title: "Settings",
            icon: "settings",
            href: "/settings",
            children: [
                { title: "Profile", href: "/settings/profile" },
                { title: "Security", href: "/settings/security" },
                { title: "Preferences", href: "/settings/preferences" },
            ],
        },
        {
            title: "Candidates",
            icon: "users",
            href: "/dashboard/candidates",
        },
        {
            title: "Projects",
            icon: "folder",
            href: "/projects",
            children: [
                { title: "Active Projects", href: "/projects/active" },
                { title: "Archived Projects", href: "/projects/archived" },
            ],
        },
    ]);

    // Type for tracking open dropdowns
    type OpenDropdowns = {
        [key: number]: boolean;
    };

    // State for tracking which dropdowns are open
    const openDropdowns = $state<OpenDropdowns>({});

    // Toggle dropdown visibility with improved handling
    function toggleDropdown(index: number, event?: Event): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // If sidebar is collapsed and trying to open a dropdown,
        // expand the sidebar first, then open the dropdown
        if (!isExpanded) {
            isExpanded = true;
            // Use setTimeout to ensure the sidebar expands before opening dropdown
            setTimeout(() => {
                openDropdowns[index] = true;
            }, 300); // Match transition duration
        } else {
            openDropdowns[index] = !openDropdowns[index];
        }
    }

    // Handle keyboard interactions
    function handleKeydown(
        event: KeyboardEvent,
        action: string,
        param?: number,
    ): void {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (action === "toggleSidebar") {
                toggleSidebar();
            } else if (
                action === "toggleDropdown" &&
                typeof param === "number"
            ) {
                toggleDropdown(param, event);
            }
        }
    }

    // Function to render the icon based on icon name
    function renderIcon(iconName: string): string {
        switch (iconName) {
            case "settings":
                return "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z";
            case "users":
                return "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z";
            case "folder":
                return "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z";
            case "grid":
                return "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z";
            case "bar-chart":
                return "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
            default:
                return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
        }
    }
</script>

<aside
    class="flex flex-col h-screen bg-black text-white transition-all duration-300 ease-in-out shadow-lg"
    class:w-64={isExpanded}
    class:w-16={!isExpanded}
>
    <!-- Header/Logo Section -->
    <div class="p-4 border-b border-gray-700 flex items-center justify-between">
        <div class="flex items-center space-x-2 overflow-hidden">
            <img src={logoSrc} alt={logoAlt} class="w-8 h-8 flex-shrink-0" />
            {#if isExpanded}
                <span
                    class="font-semibold whitespace-nowrap transition-opacity duration-300"
                    >Your Brand</span
                >
            {/if}
        </div>

        <button
            onclick={toggleSidebar}
            onkeydown={(e) => handleKeydown(e, "toggleSidebar")}
            class="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded p-1 transition-colors duration-200"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            tabindex="0"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-300"
                class:transform={!isExpanded}
                class:rotate-180={!isExpanded}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>
    </div>

    <!-- Content/Navigation Section -->
    <div
        class="flex-grow overflow-y-auto py-2 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700"
    >
        <nav>
            <ul>
                {#each navItems as item, index}
                    <li class="relative">
                        {#if item.children}
                            <!-- Dropdown Item -->
                            <div>
                                <button
                                    onclick={(e) => toggleDropdown(index, e)}
                                    onkeydown={(e) =>
                                        handleKeydown(
                                            e,
                                            "toggleDropdown",
                                            index,
                                        )}
                                    class="w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:bg-gray-800"
                                    tabindex="0"
                                    aria-expanded={openDropdowns[index]
                                        ? "true"
                                        : "false"}
                                    aria-controls={`dropdown-${index}`}
                                >
                                    <span class="flex items-center min-w-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d={renderIcon(item.icon)}
                                            />
                                        </svg>
                                        {#if isExpanded}
                                            <span class="ml-3 truncate"
                                                >{item.title}</span
                                            >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-4 w-4 ml-auto transition-transform duration-200"
                                                class:transform={openDropdowns[
                                                    index
                                                ]}
                                                class:rotate-180={openDropdowns[
                                                    index
                                                ]}
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
                                        {/if}
                                    </span>
                                </button>

                                <!-- Dropdown content with smooth transition -->
                                {#if isExpanded}
                                    <ul
                                        id={`dropdown-${index}`}
                                        class="bg-gray-900 overflow-hidden transition-all duration-300 ease-in-out"
                                        style={openDropdowns[index]
                                            ? `max-height: ${item.children.length * 40}px; opacity: 1;`
                                            : "max-height: 0; opacity: 0;"}
                                    >
                                        {#each item.children as child, childIndex}
                                            <li>
                                                <a
                                                    href={child.href}
                                                    class="block pl-12 pr-4 py-2 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:bg-gray-700"
                                                    tabindex={openDropdowns[
                                                        index
                                                    ]
                                                        ? 0
                                                        : -1}
                                                >
                                                    {child.title}
                                                </a>
                                            </li>
                                        {/each}
                                    </ul>
                                {/if}
                            </div>
                        {:else}
                            <!-- Regular Item -->
                            <a
                                href={item.href}
                                class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:bg-gray-800"
                                tabindex="0"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d={renderIcon(item.icon)}
                                    />
                                </svg>
                                {#if isExpanded}
                                    <span class="ml-3 truncate"
                                        >{item.title}</span
                                    >
                                {/if}
                            </a>
                        {/if}
                    </li>
                {/each}
            </ul>
        </nav>
    </div>

    <!-- Footer Section -->
    <div class="p-4 border-t border-gray-700 mt-auto">
        {#if isExpanded}
            <p class="text-sm text-gray-400 transition-opacity duration-300">
                {footerText}
            </p>
        {:else}
            <div class="flex justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
        {/if}
    </div>
</aside>
