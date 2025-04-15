<script setup lang="ts">
import { useField } from "vee-validate";
import { toRefs } from "vue";
import { cn } from "./../../../Utils/cn";

const props = defineProps({
  label: { type: String, required: false },
  class: { type: String, required: false },
  name: { type: String, required: true },
  placeholder: { type: String, default: "" },
  rules: { type: [Object, String], default: null },
});
const { name, rules } = toRefs(props);
const { value, errorMessage, validate } = useField(name, rules);
</script>

<template>
  <div :class="cn('flex flex-col gap-1', props.class)">
    <label
      :class="
        cn(
          'inline-flex cursor-pointer select-none items-center gap-2 text-sm font-medium leading-5 text-[#344054] dark:text-zinc-200',
        )
      "
    >
      <input
        :onchange="validate"
        type="checkbox"
        v-model="value"
        class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#7E09FF] focus:ring-2 focus:ring-[#7E09FF] dark:border-gray-600 dark:bg-transparent dark:ring-[#7E09FF] dark:focus:ring-[#7E09FF]"
      />
      <slot>
        {{ label }}
      </slot>
    </label>
    <p class="text-xs text-red-500" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
