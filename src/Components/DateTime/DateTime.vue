<script setup lang="ts">
import { computed } from "vue";
import { convertTimestamp } from "./../../Utils/datetime";

const props = defineProps<{ datetime: string; isTimestamp?: boolean }>();
const datetime = computed(() => {
  if (!props.datetime) return null;
  if (props.isTimestamp) {
    return convertTimestamp(
      new Date(Number(props.datetime) * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  }
  return convertTimestamp(props.datetime);
});
</script>
<template>
  <div v-if="datetime" class="w-full">
    <p class="whitespace-nowrap">{{ datetime?.formatedDate }}</p>
    <p class="whitespace-nowrap">{{ datetime?.formatedTime }}</p>
  </div>
</template>
