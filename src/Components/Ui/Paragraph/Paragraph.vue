<script setup lang="ts">
import { computed, defineProps } from "vue";
import { cn } from "./../../../Utils/cn";

const props = defineProps<{
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "muted";
  class?: string;
}>();

// SIZE CLASSES
const smSizeClasses = "text-sm leading-5";
const mdSizeClasses = "text-base leading-6";
const lgSizeClasses = "text-lg leading-7";

// VARIANT CLASSES
const primaryVariantClasses = "text-gray-900 dark:text-white";
const secondaryVariantClasses = "text-gray-700 dark:text-gray-300";
const mutedVariantClasses = "text-gray-500 dark:text-gray-400";

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

const variantClass = computed(() => {
  switch (props.variant) {
    case "primary":
      return primaryVariantClasses;
    case "secondary":
      return secondaryVariantClasses;
    case "muted":
      return mutedVariantClasses;
    default:
      return primaryVariantClasses;
  }
});
</script>

<template>
  <p :class="cn(sizeClass, variantClass, props.class)">
    <slot />
  </p>
</template>
