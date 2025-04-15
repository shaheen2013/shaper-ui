 <script setup lang="ts">
import { cn } from './../../../Utils/cn';
import { useField } from 'vee-validate';
import { ref, toRefs } from 'vue';

const props = defineProps<{
  checked: boolean;
  onClick: () => void;
  name: string
}>();

const { name } = toRefs(props);
const { value, errorMessage, validate } = useField(name);

</script>

<template>
  <label class="inline-flex items-center me-5 cursor-pointer">

    <input
      type="checkbox"
      class="sr-only peer"
      :checked="props.checked"
      @change="props.onClick"
    />

    <div
      :class="cn(`
        relative w-11 h-6
        ${props.checked ? 'bg-[#09AD5F]' : 'bg-gray-200'}
        rounded-full dark:${props.checked ? 'bg-[#09AD5F]' : 'bg-gray-700'}
        peer-focus:ring-4 peer-focus:ring-transparent transition-colors
      `)"
    >

      <div
        :class="cn(`
          absolute top-0.5
          h-5 w-5 bg-white border border-gray-300 rounded-full
          transition-all
          ${props.checked ? 'translate-x-5' : 'translate-x-0'}
        `)"
      ></div>
    </div>
  </label>
</template>
