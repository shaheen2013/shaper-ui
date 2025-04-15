<script setup lang="ts">
import { computed, defineProps } from "vue";
import { cn } from "./../../../Utils/cn";
import Tap from "./../../Animation//Tap.vue";

const props = defineProps<{
  type?: "reset" | "submit" | "button";
  variant?: "gradient" | "filled" | "gradientOutline" | "danger" | "text";
  size?: "sm" | "md" | "lg";
  class?: string;
  parentClass?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  id?: string;
}>();
// VARIENT CLASSESS
const gradientVariantClasses =
  "bg-gradient-to-tr hover:from-[#F16BFF] from-[#7E09FF] hover:to-[#7E09FF] to-[#F16BFF] text-white";
const filledVariantClasses = "bg-white border border-[#D0D5DD]";
const dangerVariantClasses = "bg-red-500 hover:bg-red-600 text-white";
const textVariantClasses = "text-[#7E09FF] hover:text-[#F16BFF]";
const gradientOutlineVariantClasses =
  "bg-clip-text text-transparent bg-gradient-to-tr from-[#921AFF] to-[#E863FF] border border-[#BD3FFF]";

//SIZE CLASSES
const smSizeClasses = "text-[14px] px-4 h-7";
const mdSizeClasses = "text-[16px] px-6 h-10";
const lgSizeClasses = "text-[18px] px-8 h-12";

const commonClasses =
  "font-semibold leading-6 transition-all duration-700 rounded-lg overflow-hidden w-full flex justify-center items-center";
const loadingClasses = "opacity-50 cursor-auto";

const variantClass = computed(() => {
  switch (props.variant) {
    case "gradient":
      return gradientVariantClasses;
    case "filled":
      return filledVariantClasses;
    case "danger":
      return dangerVariantClasses;
    case "text":
      return textVariantClasses;
    case "gradientOutline":
      return gradientOutlineVariantClasses;
    default:
      return gradientVariantClasses;
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return smSizeClasses;
    case "md":
      return mdSizeClasses;
    case "lg":
      return lgSizeClasses;
    default:
      return mdSizeClasses;
  }
});

const spinnerSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4";
    case "md":
      return "w-5 h-5";
    case "lg":
      return "w-6 h-6";
    default:
      return "w-5 h-5";
  }
});
</script>

<template>
  <Tap :class="cn('block w-full', props.parentClass)">
    <button
      :id="props.id"
      :disabled="loading"
      :type="props.type"
      :class="
        cn(
          commonClasses,
          variantClass,
          sizeClass,
          loading && loadingClasses,
          {
            'dark: bg-gray-300 dark:bg-gray-800 dark:text-white':
              (props.disabled && variant === 'filled') || !variant,
          },
          { 'opacity-40 dark:opacity-70': props.disabled },
          props.class,
        )
      "
      @click="props.onClick"
    >
      <slot v-if="!loading"></slot>
      <div v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          :class="
            cn('animate-spin', spinnerSize, {
              'dark:text-white':
                variant === 'gradient' || variant === 'gradientOutline',
            })
          "
        >
          <path
            fill="currentColor"
            d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
          />
        </svg>
      </div>
    </button>
  </Tap>
</template>
