<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { uploadAttachments } from "$lib/services/uploadAttachment";
    import type {
        WorkExperience,
        Education,
        Certification,
        PersonalGrowth,
        SuccessStory,
    } from "$lib/types/uploadResume";
    import type { SubmitResumeApiRequest } from "$lib/types/submitResume";

    type Category =
        | "workExperience"
        | "education"
        | "certification"
        | "personalGrowth"
        | "successStories"
        | "";

    interface DisplayItem {
        id: number;
        name: string;
        data:
            | WorkExperience
            | Education
            | Certification
            | PersonalGrowth
            | SuccessStory;
    }

    let { cvData, userId } = $props<{
        cvData: SubmitResumeApiRequest | null;
        userId: string | null;
    }>();

    let isDialogOpen = $state(false);
    let selectedCategory = $state<Category>("");
    let selectedItem = $state<string>("");
    let uploadedFiles = $state<FileList | null>(null);
    let isUploading = $state(false);
    let uploadSuccess = $state(false);
    let uploadError = $state<string>("");
    let uploadedAttachments = $state<{ id: string; filename: string }[]>([]);

    // Prepare items based on selected category
    let items = $derived(getItemsByCategory(selectedCategory));

    function getItemsByCategory(category: Category): DisplayItem[] {
        if (!cvData || !cvData.cv_data || !category) return [];

        switch (category) {
            case "workExperience":
                return cvData.cv_data.work_experience.map(
                    (exp: WorkExperience, index: number) => ({
                        id: index,
                        name: `${exp.title} at ${exp.company}`,
                        data: exp,
                    }),
                );
            case "education":
                return cvData.cv_data.education.map(
                    (edu: Education, index: number) => ({
                        id: index,
                        name: `${edu.degree} in ${edu.major} at ${edu.school}`,
                        data: edu,
                    }),
                );
            case "certification":
                return cvData.cv_data.certifications.map(
                    (cert: Certification, index: number) => ({
                        id: index,
                        name: `${cert.certification_name} by ${cert.certifier}`,
                        data: cert,
                    }),
                );
            case "personalGrowth":
                return cvData.cv_data.personal_growth.map(
                    (pg: PersonalGrowth, index: number) => ({
                        id: index,
                        name: ` ${pg.description}`,
                        data: pg,
                    }),
                );
            case "successStories":
                return cvData.cv_data.success_stories.map(
                    (ss: SuccessStory, index: number) => ({
                        id: index,
                        name: `${ss.headline}`,
                        data: ss,
                    }),
                );
            default:
                return [];
        }
    }

    function getSelectedCategoryLabel(category: Category): string {
        switch (category) {
            case "workExperience":
                return "Work Experience";
            case "education":
                return "Education";
            case "certification":
                return "Certification";
            case "personalGrowth":
                return "Personal Growth";
            case "successStories":
                return "Success Stories";
            default:
                return "";
        }
    }

    function handleFileChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            uploadedFiles = files;
        }
    }

    async function handleUpload(): Promise<void> {
        if (
            !selectedCategory ||
            !selectedItem ||
            !uploadedFiles ||
            uploadedFiles.length === 0 ||
            !userId ||
            !cvData
        ) {
            uploadError =
                "Please select a category, item, and at least one file to upload";
            return;
        }

        isUploading = true;
        uploadSuccess = false;
        uploadError = "";
        uploadedAttachments = [];

        try {
            // Store all attachment IDs
            const attachmentIds: string[] = [];

            // Upload each file
            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const response = await uploadAttachments(file);
                attachmentIds.push(response.uuid);
                console.log("Attachment uploaded:", response);

                // Add to the list of uploaded attachments
                uploadedAttachments.push({
                    id: response.uuid,
                    filename: file.name,
                });
            }

            // Update the appropriate object with the attachment_ids
            const itemIndex = parseInt(selectedItem);

            if (!isNaN(itemIndex)) {
                switch (selectedCategory) {
                    case "workExperience":
                        if (cvData.cv_data.work_experience[itemIndex]) {
                            cvData.cv_data.work_experience[
                                itemIndex
                            ].attachment_ids = attachmentIds;
                        }
                        break;
                    case "education":
                        if (cvData.cv_data.education[itemIndex]) {
                            cvData.cv_data.education[itemIndex].attachment_ids =
                                attachmentIds;
                        }
                        break;
                    case "certification":
                        if (cvData.cv_data.certifications[itemIndex]) {
                            cvData.cv_data.certifications[
                                itemIndex
                            ].attachment_ids = attachmentIds;
                        }
                    case "personalGrowth":
                        if (cvData.cv_data.personal_growth[itemIndex]) {
                            cvData.cv_data.personal_growth[
                                itemIndex
                            ].attachment_ids = attachmentIds;
                        }
                    case "successStories":
                        if (cvData.cv_data.success_stories[itemIndex]) {
                            cvData.cv_data.success_stories[
                                itemIndex
                            ].attachment_ids = attachmentIds;
                        }
                        break;
                }
            }

            uploadSuccess = true;
            console.log(
                "Attachments uploaded successfully:",
                $state.snapshot(cvData),
            );

            // Reset the file input but keep the dialog open
            resetFileInput();

            // Clear the success message after a few seconds
            setTimeout(() => {
                uploadSuccess = false;
            }, 3000);
        } catch (error) {
            console.error("Error uploading attachment:", error);
            uploadError = "Failed to upload attachment. Please try again.";
        } finally {
            isUploading = false;
        }
    }

    function handleCategoryChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        selectedCategory = select.value as Category;
        selectedItem = "";
    }

    function handleItemChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        selectedItem = select.value;
    }

    function resetFileInput(): void {
        uploadedFiles = null;
        const fileInput = document.getElementById(
            "fileUpload",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    }

    function resetForm(): void {
        uploadedFiles = null;
        uploadError = "";
        uploadSuccess = false;
        uploadedAttachments = [];
        const fileInput = document.getElementById(
            "fileUpload",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    }

    // Function to check if an item already has an attachment
    function hasAttachment(category: Category, itemId: string): boolean {
        if (!cvData || !cvData.cv_data || !category || itemId === "")
            return false;

        const index = parseInt(itemId);
        if (isNaN(index)) return false;

        switch (category) {
            case "workExperience":
                return !!cvData.cv_data.work_experience[index]?.attachment_id;
            case "education":
                return !!cvData.cv_data.education[index]?.attachment_id;
            case "certification":
                return !!cvData.cv_data.certifications[index]?.attachment_id;
            case "personalGrowth":
                return !!cvData.cv_data.personal_growth[index]?.attachment_id;
            case "successStories":
                return !!cvData.cv_data.success_stories[index]?.attachment_id;
            default:
                return false;
        }
    }

    // Function to display attachment status for selected item
    function getAttachmentStatus(category: Category, itemId: string): string {
        if (hasAttachment(category, itemId)) {
            return "Document already attached";
        }
        return "No document attached";
    }
</script>

<div class="mt-8">
    <Dialog
        bind:open={isDialogOpen}
        onOpenChange={(open: boolean) => {
            isDialogOpen = open;
            if (!open) resetForm();
        }}
    >
        <DialogTrigger>
            <Button variant="outline" class="w-full">
                Upload Supporting Documents
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>

            <div class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <Label for="category">Document Category</Label>
                    <select
                        id="category"
                        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedCategory}
                        onchange={handleCategoryChange}
                    >
                        <option value="" disabled>Select category</option>
                        <option value="workExperience">Work Experience</option>
                        <option value="education">Education</option>
                        <option value="certification">Certification</option>
                        <option value="personalGrowth">Personal Growth</option>
                        <option value="successStories">Success Stories</option>
                    </select>
                </div>

                {#if selectedCategory}
                    <div class="grid gap-2">
                        <Label for="item">Select Item</Label>
                        <select
                            id="item"
                            class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedItem}
                            onchange={handleItemChange}
                            disabled={!items.length}
                        >
                            <option value="" disabled>
                                {items.length
                                    ? "Select item"
                                    : "No items available"}
                            </option>
                            {#each items as item}
                                <option value={item.id.toString()}>
                                    {item.name}
                                </option>
                            {/each}
                        </select>

                        {#if selectedItem}
                            <p class="text-sm text-muted-foreground">
                                {getAttachmentStatus(
                                    selectedCategory,
                                    selectedItem,
                                )}
                            </p>
                        {/if}
                    </div>
                {/if}

                <div class="grid gap-2">
                    <Label for="fileUpload">Upload Files</Label>
                    <Input
                        id="fileUpload"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onchange={handleFileChange}
                        multiple
                    />
                    <p class="text-sm text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                    </p>
                </div>

                {#if uploadedAttachments.length > 0}
                    <div class="mt-2">
                        <h4 class="text-sm font-medium mb-2">
                            Uploaded Files:
                        </h4>
                        <ul class="text-sm space-y-1">
                            {#each uploadedAttachments as attachment}
                                <li class="flex items-center">
                                    <span class="text-green-600 mr-2">✓</span>
                                    {attachment.filename}
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>

            {#if uploadError}
                <p class="text-sm text-destructive">{uploadError}</p>
            {/if}

            {#if uploadSuccess}
                <p class="text-sm text-green-600">
                    Documents uploaded successfully!
                </p>
            {/if}

            <div class="flex justify-end gap-2">
                <Button
                    variant="outline"
                    onclick={() => (isDialogOpen = false)}
                >
                    Close
                </Button>
                <Button
                    disabled={isUploading ||
                        !selectedCategory ||
                        !selectedItem ||
                        !uploadedFiles ||
                        uploadedFiles.length === 0}
                    onclick={handleUpload}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</div>
