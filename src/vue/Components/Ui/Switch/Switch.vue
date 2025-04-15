<script setup lang="ts">
import { computed } from "vue";
import { cn } from "./../../../Utils/cn";

type SwitchVariant = "gradient" | "normal";
const props = defineProps<{
  checked: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: SwitchVariant;
}>();

const changeHandler = () => {
  if (!props.disabled && props.onClick) {
    props.onClick();
  }
};
const currentVarient = computed<SwitchVariant>(() => {
  return props.variant || "normal";
});
</script>

<template>
  <label
    :class="
      cn(
        'relative inline-flex w-11 cursor-pointer items-center overflow-hidden',
        {
          'cursor-not-allowed':
            typeof props.disabled === 'boolean' && props.disabled === true,
        },
      )
    "
  >
    <!-- Hidden Checkbox -->
    <input
      type="checkbox"
      class="peer sr-only"
      :checked="props.checked"
      @change="changeHandler"
      :disabled="props.disabled"
    />
    <!-- Toggle UI -->
    <div
      :class="
        cn(
          `relative h-6 w-full rounded-full bg-gray-200 transition-colors peer-focus:ring-4 peer-focus:ring-transparent dark:bg-gray-700`,
          {
            'bg-[#09AD5F] dark:bg-[#09AD5F]':
              props.checked && currentVarient === 'normal',
            'bg-gradient-to-r from-[#9119FF] to-[#E361FA]':
              props.checked && currentVarient === 'gradient',
            'bg-gradient-to-r from-[#97949a] to-[#9c979c] opacity-50':
              props.disabled,
          },
        )
      "
    >
      <!-- Circle/Handle -->
      <div
        :class="
          cn(
            `absolute top-0.5 h-5 w-5 rounded-full border border-gray-300 bg-white transition-all ${props.checked ? 'translate-x-5' : 'translate-x-0'} `,
          )
        "
      ></div>
    </div>
    <div
      v-if="props.loading"
      class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-full bg-gray-300/50 dark:bg-gray-800/50"
    >
      <span class="h-[20px] w-[20px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          :class="cn('animate-spin text-purple-700 dark:text-purple-500')"
        >
          <path
            fill="currentColor"
            d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
          />
        </svg>
      </span>
    </div>
  </label>
</template>
