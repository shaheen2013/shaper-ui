<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
    onSearchInputChange: (e: any) => void;
    tableName: string;
    searchable?: boolean;
}>();

const search = ref<string>("");

let debounceDuration: ReturnType<typeof setTimeout> | null = null;

watch(
    () => search.value,
    (newValue) => {
        if (debounceDuration) clearTimeout(debounceDuration);
        debounceDuration = setTimeout(() => {
            props.onSearchInputChange(newValue);
        }, 500);
    },
);

onMounted(() => {
    search.value = searchFromParams.value || "";
});

const searchFromParams = computed(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search");
});
</script>
<template>
    <div
        class="flex w-full flex-col flex-wrap items-center justify-between gap-3 rounded-t-lg p-4 sm:flex-row"
    >
        <h4
            class="text-lg font-semibold capitalize leading-7 text-[#0C111D] dark:text-white"
        >
            {{ props.tableName }}
        </h4>
        <div
            class="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
            <div
                class="relative flex w-full flex-row sm:w-auto"
                v-if="props.searchable"
            >
                <span
                    class="absolute left-0 top-[50%] translate-y-[-50%] px-4 text-[#6B7280]"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            d="M6.5 1C9.53757 1 12 3.46243 12 6.5C12 7.74832 11.5841 8.89951 10.8834 9.82257L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7641 15.2966 14.3474 15.3208 14.0538 15.1029L13.9697 15.0303L9.82257 10.8834C8.89951 11.5841 7.74832 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1ZM6.5 2.5C4.29086 2.5 2.5 4.29086 2.5 6.5C2.5 8.70914 4.29086 10.5 6.5 10.5C8.70914 10.5 10.5 8.70914 10.5 6.5C10.5 4.29086 8.70914 2.5 6.5 2.5Z"
                            fill="currentColor"
                        />
                    </svg>
                </span>
                <input
                    placeholder="Search"
                    class="w-full rounded-lg border border-[#CECFD2] bg-[#F9FAFB] px-3.5 py-[9px] pl-10 text-sm text-[#6B7280] !outline-none !ring-0 focus:border-[#7E09FF] dark:border-[#61646C] dark:bg-[#333741] dark:text-[#94969C] md:w-[200px] lg:w-[300px] xl:w-[600px]"
                    v-model="search"
                />
            </div> 

            <slot name="top_header_action_button"></slot>
        </div>
    </div>
</template>
