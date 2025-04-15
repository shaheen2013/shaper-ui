<script setup lang="ts">
import { computed } from "vue";
import { cn } from "./../../Utils/cn";
type CardVarientType = "gradient" | "normal";

const props = defineProps<{
  class?: string;
  parentClass?: string;
  varient?: CardVarientType;
  id?: string;
}>();

const currentVarient = computed<CardVarientType>(() => {
  return props.varient || "normal";
});
</script>

<template>
  <div
    :id="props.id"
    :class="
      cn(
        'w-full',
        {
          'rounded-lg border border-[#ECECED] p-6 dark:border-[#1F242F]':
            currentVarient === 'normal',
        },
        {
          'rounded-[8px] border bg-gradient-to-r from-[#981FFF] to-[#F16BFF] p-[1px] dark:border-[#1F242F]':
            currentVarient === 'gradient',
        },
        currentVarient === 'normal' && props.class,
        currentVarient === 'gradient' && props.parentClass,
      )
    "
  >
    <template v-if="currentVarient === 'gradient'">
      <div
        :class="
          cn(
            'w-full rounded-[6px] bg-white p-6 dark:bg-[#000000] dark:text-white',
            currentVarient === 'gradient' && props.class,
          )
        "
      >
        <slot />
      </div>
    </template>
    <slot v-else />
  </div>
</template>
