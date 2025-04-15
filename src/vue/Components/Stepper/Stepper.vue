<script setup lang="ts">
import { cn } from "./../../Utils/cn";

const props = defineProps<{
  step: number;
  options: {
    label: string;
    value: number;
  }[];
  lineClass?: string;
  onClick?: (value: number) => void;
  class?: string;
}>();

const emit = defineEmits();
</script>

<template>
  <div :class="props?.class">
    <ul class="flex items-center justify-center text-black dark:text-white">
      <li
        v-for="(option, index) in props.options"
        :key="index"
        class="flex cursor-pointer items-center"
        @click="() => props.onClick && props.onClick(option.value)"
      >
        <!-- Line -->
        <div
          :class="
            cn(
              'ml-2 h-1 w-10 bg-gray-200 dark:bg-gray-500 md:w-20 lg:w-32',
              {
                'bg-[#7E09FF] dark:bg-[#7E09FF]': option.value <= props.step,
              },
              props.lineClass,
            )
          "
          v-if="index !== 0"
        />
        <!-- Step -->
        <div class="flex items-center gap-2">
          <div
            :class="
              cn(
                'flex h-9 w-9 items-center justify-center rounded-full border-[1px] border-[#ECECED] bg-[#ECECED] font-bold text-black dark:bg-gray-800 dark:text-white',
                {
                  'border-[#7E09FF] bg-gray-200 text-black':
                    option.value === props.step,
                },
                {
                  'border-[#7E09FF] bg-[#7E09FF] text-white dark:bg-[#7E09FF]':
                    option.value < props.step,
                },
              )
            "
          >
            <svg
              v-if="option.value < props.step"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="h-5 w-5"
              fill="white"
            >
              <path
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>
            <span v-else> {{ option.value }}</span>
          </div>
          <div
            class="text-sm"
            :class="
              cn({
                'font-bold': option.value === props.step,
              })
            "
          >
            {{ option.label }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
