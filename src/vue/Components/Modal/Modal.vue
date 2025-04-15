<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { cn } from "./../../Utils/cn";

const props = defineProps<{
  handleClose: () => void;
  open: Boolean;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  customBody?: boolean;
  class?: string;
  allowOutsideClick?: boolean;
  teleport?: string; // New optional prop for teleport target
}>();

const modalRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (event.target === modalRef.value && !props.allowOutsideClick) {
    props.handleClose();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const modalSize = computed(() => {
  if (props?.size) {
    switch (props.size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "3xl":
        return "max-w-3xl";
      case "4xl":
        return "max-w-4xl";
      case "5xl":
        return "max-w-5xl";
      case "6xl":
        return "max-w-6xl";
      case "7xl":
        return "max-w-7xl";
    }
  }
  return "max-w-md";
});

const defaultBodyStyle = computed(() => {
  if (!props?.customBody) {
    return "p-6 gap-5";
  }
});
</script>

<template>
  <Teleport :to="props.teleport || 'body'" :disabled="!props.teleport">
    <transition
      leave-active-class="duration-500 transition-all ease-in-out motion-scale-out-[1.1]"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="duration-500 transition-all ease-in-out-[1.1]"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div
        v-if="open"
        @click="handleClickOutside"
        ref="modalRef"
        :class="
          cn(
            'modal fixed inset-0 z-[50] flex h-full w-full items-center justify-center overflow-hidden bg-black/60 p-3',
          )
        "
      >
        <div
          :class="
            cn(
              'flex max-h-full w-full flex-col overflow-auto rounded-lg bg-white dark:bg-[#1F242F]',
              'motion-preset-expand',
              defaultBodyStyle,
              modalSize,
              props.class,
            )
          "
        >
          <slot></slot>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-in {
  animation: fadeIn 0.2s ease-in forwards;
}
</style>
