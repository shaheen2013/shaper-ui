<script setup lang="ts">
import { computed } from "vue";
import { cn } from "./../../Utils/cn";
import ErrorIcon from "../Icons/ErrorIcon.vue";
import InfoIcon from "../Icons/InfoIcon.vue";
import SuccessIcon from "../Icons/SuccessIcon.vue";
import WarningIcon from "../Icons/WarningIcon.vue";

const props = defineProps<{
  type: "error" | "info" | "success" | "warning" | "dark";
}>();

const icon = computed(() => {
  switch (props.type) {
    case "error":
      return ErrorIcon;
    case "info":
      return InfoIcon;
    case "success":
      return SuccessIcon;
    case "warning":
      return WarningIcon;
    case "dark":
      return null;
  }
});
</script>

<template>
  <div
    :class="
      cn('item mb-4 flex gap-2 rounded-lg p-4 text-sm', {
        'bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400':
          props.type === 'info',
        'bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400':
          props.type === 'error',
        'bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400':
          props.type === 'success',
        'bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-300':
          props.type === 'warning',
        'bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300':
          props.type === 'dark',
      })
    "
    role="alert"
  >
    <span class="pr-1 font-medium"><component :is="icon" /> </span>
    <slot />
  </div>
</template>
