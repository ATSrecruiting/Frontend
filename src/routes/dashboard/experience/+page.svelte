<script lang="ts">
    import {
        ArrowLeft,
        Calendar,
        MapPin,
        Building,
        Paperclip,
        CheckCircle,
        Shield,
        Users,
        Info,
        X,
        Loader,
        ExternalLink,
        FileText,
        Image,
        Download,
        ChevronDown,
        Briefcase,
        Target,
        Award,
    } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import Carousel from "$lib/components/carousel/Carousel.svelte";

    // Props
    let { candidateId, experienceId } = $props<{
        candidateId: string;
        experienceId: string;
    }>();

    // Static data for now
    const experience = {
        id: experienceId,
        company: "Google",
        title: "Senior Software Engineer",
        location: "Mountain View, CA",
        start_date: "Jan 2022",
        end_date: "Dec 2023",
        employment_type: "Full-time",
        description:
            "Led a team of 5 engineers to develop and maintain scalable web applications serving millions of users. Architected microservices infrastructure and implemented CI/CD pipelines that reduced deployment time by 60%. Collaborated with cross-functional teams to deliver high-impact features and mentor junior developers.",
        key_achievements: [
            "Improved application performance by 40% through optimization",
            "Led migration of legacy systems to modern cloud architecture",
            "Mentored 8 junior engineers and conducted technical interviews",
            "Delivered 15+ major features with 99.9% uptime",
        ],
        skills: [
            "JavaScript",
            "Python",
            "React",
            "Node.js",
            "AWS",
            "Docker",
            "Kubernetes",
        ],
        attachments: [
            { id: "1", name: "Employment_Letter.pdf", type: "pdf" },
            { id: "2", name: "Performance_Review.pdf", type: "pdf" },
            { id: "3", name: "Team_Photo.jpg", type: "image" },
        ],
        projects: [
            {
                id: "1",
                name: "User Analytics Dashboard",
                description:
                    "Built a comprehensive analytics dashboard that provides real-time insights into user behavior and application performance.",
                technologies: ["React", "D3.js", "Node.js", "PostgreSQL"],
                duration: "6 months",
                team_size: 4,
                impact: "Increased user engagement by 25% and reduced churn rate by 15%",
            },
            {
                id: "2",
                name: "Microservices Migration",
                description:
                    "Led the migration of monolithic architecture to microservices, improving scalability and maintainability.",
                technologies: ["Docker", "Kubernetes", "AWS", "Python"],
                duration: "8 months",
                team_size: 6,
                impact: "Reduced deployment time by 60% and improved system reliability",
            },
            {
                id: "3",
                name: "AI-Powered Recommendation Engine",
                description:
                    "Developed machine learning algorithms to provide personalized content recommendations to users.",
                technologies: ["Python", "TensorFlow", "Apache Kafka", "Redis"],
                duration: "4 months",
                team_size: 3,
                impact: "Increased user session time by 30% and click-through rates by 20%",
            },
        ],
        verifications: [
            {
                recruiter_id: "1",
                recruiter_name: "John Smith",
                recruiter_company: "TechRecruit Inc.",
                verified_at: "2024-01-15T10:30:00Z",
                notes: "Verified employment details directly with HR department",
            },
            {
                recruiter_id: "2",
                recruiter_name: "Sarah Johnson",
                recruiter_company: "Elite Recruiting",
                verified_at: "2024-01-20T14:20:00Z",
                notes: "Confirmed role and responsibilities with former manager",
            },
        ],
    };

    // Component State
    let modalOpen = $state(false);
    let expandedSections = $state({
        description: true,
        achievements: true,
        projects: true,
        documents: true,
        verifications: true,
    });

    function goBack() {
        goto(`/candidates/${candidateId}`);
    }

    function openDocumentCarousel() {
        modalOpen = true;
    }

    function closeModal() {
        modalOpen = false;
    }

    function toggleSection(section: keyof typeof expandedSections) {
        expandedSections[section] = !expandedSections[section];
    }

    function formatVerificationDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (e) {
            return "Invalid date";
        }
    }

    function getFileIcon(type: string) {
        switch (type) {
            case "pdf":
                return FileText;
            case "image":
                return Image;
            default:
                return Paperclip;
        }
    }
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <button
                        type="button"
                        class="flex items-center text-gray-600 hover:text-black transition-colors"
                        onclick={goBack}
                    >
                        <ArrowLeft class="h-5 w-5 mr-2" />
                        Back to Candidate
                    </button>
                </div>

                <div class="flex items-center space-x-3">
                    {#if experience.verifications.length > 0}
                        <div
                            class="flex items-center text-green-600 text-sm font-medium"
                        >
                            <CheckCircle class="h-4 w-4 mr-1" />
                            Verified by {experience.verifications.length} recruiter{experience
                                .verifications.length > 1
                                ? "s"
                                : ""}
                        </div>
                    {:else}
                        <div
                            class="flex items-center text-red-500 text-sm font-medium"
                        >
                            Not verified
                        </div>
                    {/if}

                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        <Shield class="h-4 w-4 mr-2" />
                        Verify Experience
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Experience Overview -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div class="p-8">
                <div class="flex items-start justify-between mb-6">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">
                            {experience.title}
                        </h1>
                        <div
                            class="flex items-center space-x-6 text-gray-600 mb-4"
                        >
                            <div class="flex items-center">
                                <Building class="h-5 w-5 mr-2" />
                                <span class="text-lg font-semibold"
                                    >{experience.company}</span
                                >
                            </div>
                            <div class="flex items-center">
                                <MapPin class="h-5 w-5 mr-2" />
                                <span>{experience.location}</span>
                            </div>
                            <div class="flex items-center">
                                <Calendar class="h-5 w-5 mr-2" />
                                <span
                                    >{experience.start_date} - {experience.end_date}</span
                                >
                            </div>
                        </div>
                        <div
                            class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                            <Briefcase class="h-4 w-4 mr-1" />
                            {experience.employment_type}
                        </div>
                    </div>
                </div>

                <!-- Skills -->
                <div class="mb-6">
                    <h3
                        class="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide"
                    >
                        Skills & Technologies
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        {#each experience.skills as skill}
                            <span
                                class="inline-flex items-center px-3 py-1 bg-black text-white text-sm rounded-md"
                            >
                                {skill}
                            </span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content Column -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Description Section -->
                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <button
                        type="button"
                        class="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        onclick={() => toggleSection("description")}
                    >
                        <h2 class="text-lg font-semibold text-gray-900">
                            Role Description
                        </h2>
                        <ChevronDown
                            class="h-5 w-5 text-gray-500 transform transition-transform {expandedSections.description
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>

                    {#if expandedSections.description}
                        <div class="p-6">
                            <p class="text-gray-700 leading-relaxed">
                                {experience.description}
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Key Achievements Section -->
                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <button
                        type="button"
                        class="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        onclick={() => toggleSection("achievements")}
                    >
                        <h2
                            class="text-lg font-semibold text-gray-900 flex items-center"
                        >
                            <Award class="h-5 w-5 mr-2" />
                            Key Achievements
                        </h2>
                        <ChevronDown
                            class="h-5 w-5 text-gray-500 transform transition-transform {expandedSections.achievements
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>

                    {#if expandedSections.achievements}
                        <div class="p-6">
                            <ul class="space-y-3">
                                {#each experience.key_achievements as achievement}
                                    <li class="flex items-start">
                                        <div
                                            class="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2.5 mr-3"
                                        ></div>
                                        <span class="text-gray-700"
                                            >{achievement}</span
                                        >
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>

                <!-- Projects Section -->
                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <button
                        type="button"
                        class="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        onclick={() => toggleSection("projects")}
                    >
                        <h2
                            class="text-lg font-semibold text-gray-900 flex items-center"
                        >
                            <Target class="h-5 w-5 mr-2" />
                            Projects ({experience.projects.length})
                        </h2>
                        <ChevronDown
                            class="h-5 w-5 text-gray-500 transform transition-transform {expandedSections.projects
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>

                    {#if expandedSections.projects}
                        <div class="divide-y divide-gray-100">
                            {#each experience.projects as project}
                                <div class="p-6">
                                    <div
                                        class="flex items-start justify-between mb-3"
                                    >
                                        <h3
                                            class="text-lg font-semibold text-gray-900"
                                        >
                                            {project.name}
                                        </h3>
                                        <div
                                            class="text-sm text-gray-500 text-right"
                                        >
                                            <div>{project.duration}</div>
                                            <div>
                                                Team of {project.team_size}
                                            </div>
                                        </div>
                                    </div>

                                    <p class="text-gray-700 mb-4">
                                        {project.description}
                                    </p>

                                    <div class="mb-4">
                                        <h4
                                            class="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide"
                                        >
                                            Technologies
                                        </h4>
                                        <div class="flex flex-wrap gap-2">
                                            {#each project.technologies as tech}
                                                <span
                                                    class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                                                >
                                                    {tech}
                                                </span>
                                            {/each}
                                        </div>
                                    </div>

                                    <div
                                        class="bg-green-50 border border-green-200 rounded-md p-3"
                                    >
                                        <h4
                                            class="text-sm font-medium text-green-800 mb-1"
                                        >
                                            Impact
                                        </h4>
                                        <p class="text-sm text-green-700">
                                            {project.impact}
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Documents Section -->
                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <button
                        type="button"
                        class="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        onclick={() => toggleSection("documents")}
                    >
                        <h3
                            class="text-lg font-semibold text-gray-900 flex items-center"
                        >
                            <Paperclip class="h-5 w-5 mr-2" />
                            Documents ({experience.attachments.length})
                        </h3>
                        <ChevronDown
                            class="h-5 w-5 text-gray-500 transform transition-transform {expandedSections.documents
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>

                    {#if expandedSections.documents}
                        <div class="p-6">
                            <div class="space-y-3 mb-4">
                                {#each experience.attachments as doc}
                                    {@const IconComponent = getFileIcon(
                                        doc.type,
                                    )}
                                    <div
                                        class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                    >
                                        <div
                                            class="flex items-center flex-1 min-w-0"
                                        >
                                            <IconComponent
                                                class="h-4 w-4 mr-2 text-gray-500 flex-shrink-0"
                                            />
                                            <span
                                                class="text-sm text-gray-700 truncate"
                                                >{doc.name}</span
                                            >
                                        </div>
                                        <button
                                            type="button"
                                            class="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Download {doc.name}"
                                        >
                                            <Download class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                            </div>

                            <button
                                type="button"
                                class="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                                onclick={openDocumentCarousel}
                            >
                                View All Documents
                            </button>
                        </div>
                    {/if}
                </div>

                <!-- Verifications Section -->
                <div
                    class="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <button
                        type="button"
                        class="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        onclick={() => toggleSection("verifications")}
                    >
                        <h3
                            class="text-lg font-semibold text-gray-900 flex items-center"
                        >
                            <Users class="h-5 w-5 mr-2" />
                            Verifications ({experience.verifications.length})
                        </h3>
                        <ChevronDown
                            class="h-5 w-5 text-gray-500 transform transition-transform {expandedSections.verifications
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>

                    {#if expandedSections.verifications}
                        <div class="p-6">
                            {#if experience.verifications.length > 0}
                                <div class="space-y-4">
                                    {#each experience.verifications as verification}
                                        <div
                                            class="border border-green-200 bg-green-50 rounded-md p-4"
                                        >
                                            <div class="flex items-start">
                                                <CheckCircle
                                                    class="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                                                />
                                                <div class="flex-1 min-w-0">
                                                    <p
                                                        class="text-sm font-medium text-green-800"
                                                    >
                                                        {verification.recruiter_name}
                                                    </p>
                                                    <p
                                                        class="text-xs text-green-600 mb-2"
                                                    >
                                                        {verification.recruiter_company}
                                                    </p>
                                                    <p
                                                        class="text-xs text-green-600 mb-2"
                                                    >
                                                        {formatVerificationDate(
                                                            verification.verified_at,
                                                        )}
                                                    </p>
                                                    {#if verification.notes}
                                                        <p
                                                            class="text-sm text-green-700 mt-2 italic"
                                                        >
                                                            "{verification.notes}"
                                                        </p>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="text-center py-6">
                                    <Shield
                                        class="h-8 w-8 text-gray-400 mx-auto mb-2"
                                    />
                                    <p class="text-gray-500 text-sm">
                                        No verifications yet
                                    </p>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

{#if modalOpen}
    <Carousel
        attachment_ids={experience.attachments.map((a) => a.id)}
        onClose={closeModal}
    />
{/if}
