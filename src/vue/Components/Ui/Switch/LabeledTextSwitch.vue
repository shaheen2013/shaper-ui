<script setup lang="ts">
import SwitchInput from "./SwitchInput.vue";

defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  class: String,
  name: { type: String, required: true },
  rules: { type: [Object, String], default: null },
});
</script>

<template>
  <label class="flex flex-col gap-1">
    <p class="text-sm font-medium leading-5 text-[#344054] dark:text-zinc-200">
      {{ label }}
      <span class="text-red-600">{{ required ? "*" : "" }}</span>
    </p>
    <SwitchInput :name="name" :rules="rules" />
  </label>
</template>
