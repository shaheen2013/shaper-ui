<script setup lang="ts">
import { computed, defineProps } from "vue";
import { cn } from "./../../../Utils/cn";

const props = defineProps<{
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "danger" | "gradient";
  class?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}>();

// SIZE CLASSES
const smSizeClasses = "text-sm leading-5";
const mdSizeClasses = "text-md leading-6";
const lgSizeClasses = "text-lg leading-7";
const xlSizeClasses = "text-xl leading-8";

// VARIANT CLASSES
const primaryVariantClasses = "text-gray-900 dark:text-white font-bold";
const secondaryVariantClasses = "text-gray-600 dark:text-gray-400 font-medium";
const dangerVariantClasses = "text-red-600 dark:text-red-400 font-bold";
const gradientVariantClasses =
  "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text font-semibold";

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return smSizeClasses;
    case "md":
      return mdSizeClasses;
    case "lg":
      return lgSizeClasses;
    case "xl":
      return xlSizeClasses;
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
    case "danger":
      return dangerVariantClasses;
    case "gradient":
      return gradientVariantClasses;
    default:
      return primaryVariantClasses;
  }
});

const Tag = computed(() => props.as || "h2");
</script>

<template>
  <component :is="Tag" :class="cn(sizeClass, variantClass, props.class)">
    <slot />
  </component>
</template>
