<script lang="ts">
    import { CheckCircle } from "lucide-svelte";

    type Verification = {
        recruiter_id: string;
        recruiter_name: string;
        recruiter_company: string;
        verified_at: string;
        notes: string;
    };

    let { verification } = $props<{ verification: Verification }>();

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
</script>

<div class="border border-green-200 bg-green-50 rounded-md p-4">
    <div class="flex items-start">
        <CheckCircle class="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-green-800">
                {verification.recruiter_name}
            </p>
            <p class="text-xs text-green-600 mb-2">
                {verification.recruiter_company}
            </p>
            <p class="text-xs text-green-600 mb-2">
                {formatVerificationDate(verification.verified_at)}
            </p>
            {#if verification.notes}
                <p class="text-sm text-green-700 mt-2 italic">
                    "{verification.notes}"
                </p>
            {/if}
        </div>
    </div>
</div>