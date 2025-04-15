<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
// import ConfirmModal from "../Modal/Modals/ConfirmModal.vue";
// const modalOpen = ref(false);
// const handleModalClose = () => (modalOpen.value = false);
</script>

<template>
  <a :href="usePage().props.auth_url + '/billing'">
    <Button
      class="group flex items-center gap-2 rounded-lg bg-white px-2 py-1 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800 sm:bg-gradient-to-r sm:from-[#EF6820] sm:to-[#F17F37] sm:hover:from-[#EF6000] sm:hover:to-[#EF7A20] dark:sm:hover:from-[#EF6000] dark:sm:hover:to-[#EF7A20]"
    >
      <div class="flex items-center gap-1">
        <div
          class="text-[#EF6820] transition-transform duration-300 group-hover:rotate-12 dark:text-[#EF6820] sm:text-white dark:sm:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            class="size-5 pr-1 text-white"
          >
            <path
              d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"
            />
          </svg>
        </div>
        <div class="hidden sm:block">
          <div
            class="flex items-center border-r border-r-white/20 pr-2 text-white dark:border-r-white/20"
          >
            <h6 class="text-sm font-medium tracking-wide">End Trial</h6>
          </div>
        </div>
      </div>
      <div class="hidden sm:block">
        <div
          class="relative flex flex-col justify-start gap-0 pl-1 text-left text-xs font-medium tracking-wide text-white dark:text-white"
        >
          <span class="text-[10px] uppercase tracking-wider opacity-80"
            >Trial period</span
          >
          <div class="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="text-xs font-medium">{{
              usePage().props.trialEndsAtText
            }}</span>
          </div>
        </div>
      </div>
    </Button>
  </a>
  <!-- <ConfirmModal
    title="End trial period?"
    description="This will end your trial and start your regular subscription immediately. Your trial benefits will no longer be available."
    :open="modalOpen"
    :handleModalClose="handleModalClose"
    confirmButtonText="End Trial"
    teleport="body"
    >Trial Card</ConfirmModal
  > -->
</template>
