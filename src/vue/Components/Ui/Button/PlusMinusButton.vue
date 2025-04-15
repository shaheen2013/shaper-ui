<script setup lang="ts">
import Card from "../Card/Card.vue";
import Tap from "./../../Animation/Tap.vue";

const props = defineProps<{
  onClickPlus: (e?: any) => void;
  onClickMinus: (e?: any) => void;
  quantity: number;
}>();
</script>

<template>
  <Tap class="w-fit">
    <Card class="flex w-fit items-center gap-0 px-0 py-0 dark:text-white">
      <span class="px-3 py-2" @click="props.onClickMinus" v-if="quantity">
        <svg
          width="12"
          height="2"
          viewBox="0 0 12 2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="-1"
            y="0.25"
            width="14"
            height="1.5"
            rx="0.75"
            fill="currentColor"
          />
        </svg>
      </span>
      <span v-if="quantity">{{ quantity }}</span>
      <span @click="props.onClickPlus" class="px-3 py-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.5 -1.25C6.5 -1.66421 6.16421 -2 5.75 -2C5.33579 -2 5 -1.66421 5 -1.25V5H-1.25C-1.66421 5 -2 5.33579 -2 5.75C-2 6.16421 -1.66421 6.5 -1.25 6.5H5V12.75C5 13.1642 5.33579 13.5 5.75 13.5C6.16421 13.5 6.5 13.1642 6.5 12.75V6.5H12.75C13.1642 6.5 13.5 6.16421 13.5 5.75C13.5 5.33579 13.1642 5 12.75 5H6.5V-1.25Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </Card>
  </Tap>
</template>
