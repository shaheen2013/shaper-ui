<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import SearchIcon from "./../Icons/SearchIcon.svg";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits();
function handleChange(event: InputEvent) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="handleChange"
      class="w-full rounded-md border-[2px] bg-[#F5F5F6] px-12 py-2 focus:border-[#7E09FF] focus:outline-none dark:border-[#4B5563] dark:bg-[#374151] dark:text-white dark:focus:border-[#7E09FF]"
      placeholder="Search"
    />
    <img
      class="absolute left-4 top-[50%] translate-y-[-50%]"
      :src="SearchIcon"
    />
  </div>
</template>
