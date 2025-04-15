<script setup lang="ts">
import { ref } from "vue";
import { cn } from "./../../Utils/cn";

const props = defineProps({
  class: String,
});

const style = ref({
  transform: "scale(1)",
  opacity: 1,
  transition: "transform 0.2s, opacity 0.2s",
});

const onTap = () => {
  style.value = {
    ...style.value,
    transform: "scale(0.90)",
    opacity: 0.8,
  };
};

const onRelease = () => {
  style.value = {
    ...style.value,
    transform: "scale(1)",
    opacity: 1,
  };
};
</script>

<template>
  <div
    :style="style"
    @mousedown="onTap"
    @mouseup="onRelease"
    @mouseleave="onRelease"
    :class="cn('inline-block cursor-pointer', props.class)"
  >
    <slot />
</div>
</template>
