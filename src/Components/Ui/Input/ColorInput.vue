<script setup lang="ts">
import { useField } from "vee-validate";
import { ref, toRefs } from "vue";
import { cn } from "./../../../Utils/cn";

const props = defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  class: String,
  name: { type: String, required: true },
  rules: { type: [Object, String], default: null },
  disabled: { type: Boolean, default: false },
  defaultValue: { type: String, default: "" },
});

const { name, rules } = toRefs(props);
const { value, errorMessage, validate } = useField(name, rules, {
  initialValue: props.defaultValue,
});

const inputRef = ref();

const handleClick = () => {
  inputRef.value.click();
};
</script>

<template>
  <label class="flex w-full flex-col gap-1">
    <!-- Label -->
    <p
      class="select-none text-sm font-medium leading-5 text-[#344054] dark:text-white"
    >
      {{ label }}
      <span class="text-red-500">{{ required ? "*" : "" }}</span>
    </p>
    <div class="relative flex flex-col gap-4">
      <!-- Color input box -->
      <input
        :onblur="validate"
        type="color"
        v-model="value"
        class="absolute opacity-0"
        ref="inputRef"
      />
      <!-- Color display box -->
      <div
        @click="handleClick"
        :class="
          cn(
            'h-[150px] w-full cursor-pointer rounded-lg',
            errorMessage ? 'border-red-600 focus:border-red-600' : '',
          )
        "
        :style="`background-color: ${value};`"
      ></div>
      <!-- Color code display -->
      <div class="flex flex-col gap-2 text-[#344054] dark:text-white">
        <p>Code</p>
        <input
          :onblur="validate"
          v-model="value"
          :class="[
            'h-[40px] w-full rounded-lg border-[1px] border-gray-700 px-6 py-6 text-[16px] focus:border-purple-800 text-gray-800 dark:text-white dark:bg-gray-800 focus-visible:outline-none ',
          ]"
        />
      </div>
    </div>
    <!-- Error message display -->
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </label>
</template>
