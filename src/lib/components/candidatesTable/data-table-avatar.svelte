<script lang="ts">
    function getInitials(first_name: string, last_name: string): string {
        return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
    }

    let { first_name, last_name } = $props<{
        first_name: string;
        last_name: string;
    }>();
</script>

<div class="flex items-center justify-center">
    <div
        class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
    >
        {getInitials(first_name, last_name)}
    </div>
</div>
