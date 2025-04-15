<script setup lang="ts">
import { computed } from "vue";
import { darkenColor } from "../../Utils/colorUtils";
import { cn } from "./../../Utils/cn";

const props = defineProps<{
  type?: "success" | "error" | "warning" | "info" | "get" | "post" | "delete";
  size?: "sm" | "md" | "lg";
  text: string;
  backgroundColor?: string;
  textColor?: string;
  noDot?: boolean;
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-xs";
    case "md":
      return "text-sm";
    case "lg":
      return "text-base";
    default:
      return "text-base";
  }
});

// Compute background and text colors based on props
const style = computed(() => {
  if (props.backgroundColor) {
    return {
      background: props.backgroundColor,
      color: props.textColor || darkenColor(props.backgroundColor),
    };
  }
  return {};
});
</script>

<template>
  <div
    :class="
      cn(
        'inline-flex flex-row items-center gap-2 rounded-full px-[10px] py-[2px] font-medium',
        {
          'bg-[#ECFDF3] text-[#00B21D]': props.type === 'success' && !props.backgroundColor,
          'bg-[#FFE4E4] text-[#EF4444]': props.type === 'error' && !props.backgroundColor,
          'bg-[#f3e2c6] text-[#B54708]': props.type === 'warning' && !props.backgroundColor,
          'bg-[#E9F5FF] text-[#1D4ED8]': props.type === 'info' && !props.backgroundColor,
          'bg-[#0F6AB4] text-[#FFFFFF]': props.type === 'get' && !props.backgroundColor,
          'bg-[#10A54A] text-[#FFFFFF]': props.type === 'post' && !props.backgroundColor,
          'bg-[#A41E22] text-[#FFFFFF]': props.type === 'delete' && !props.backgroundColor,
        },
        sizeClass
      )
    "
    :style="style"
  >
    <div
      v-if="!props.noDot"
      :class="
        cn('h-3 w-3 rounded-full', {
          'bg-[#00B21D]': props.type === 'success',
          'bg-[#EF4444]': props.type === 'error',
          'bg-[#B54708]': props.type === 'warning',
          'bg-[#1D4ED8]': props.type === 'info',
          'bg-[#FFFFF1]': props.type === 'get',
          'bg-[#FFFFF2]': props.type === 'post',
          'bg-[#FFFFF3]': props.type === 'delete',
        })
      "
    />
    <span>{{ props.text }}</span>
  </div>
</template>
