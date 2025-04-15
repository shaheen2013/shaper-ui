<script setup lang="ts">
import { computed } from "vue";
import { cn } from "./../../Utils/cn";

const props = withDefaults(
  defineProps<{
    n?: number;
    barHeight?: number;
    class?: string;
  }>(),
  {
    n: 1,
    barHeight: 24,
  },
);

const range = computed(() => {
  return Array.from({ length: props.n || 1 }, (_, i) => i + 1);
});
</script>

<template>
  <div :class="cn('mx-auto w-full', props.class)">
    <div class="animate-pulse space-y-3">
      <div class="flex space-x-4">
        <div class="flex-1 space-y-2">
          <div
            v-for="i in range"
            class="w-full rounded-md bg-gray-200 dark:bg-gray-700"
            :style="'height: ' + barHeight + 'px;'"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
