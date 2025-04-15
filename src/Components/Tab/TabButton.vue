<script setup lang="ts">
import { type Component } from "vue";
import { cn } from "./../../Utils/cn";
import { formatNumberToK } from "./../../Utils/formatNumber";

const props = defineProps<{
  label: string;
  counter?: number | null;
  onClick: () => void;
  active: boolean;
  icon?: Component | string; // Allow icon to be a Vue component or a string
}>();

const activeBtnClasses =
  " text-[#7E09FF] dark:text-[#7E09FF] bg-[#F2E6FF] dark:bg-[#0C111D] border-[#7E09FF]";
const activeCounterClasses = "border-[#C48EFF]";

const handleClick = () => {
  props.onClick();
};
</script>

<template>
  <button
    @click="handleClick"
    type="button"
    :class="
      cn(
        'flex flex-row items-center gap-2 rounded-t-lg border-b-2 border-transparent px-5 py-2.5 text-[#0C111D] transition-all duration-500 dark:text-[#CECFD2]',
        props.active && activeBtnClasses,
      )
    "
  >
    <span>
      <template v-if="typeof props.icon === 'string'">
        <img :src="props.icon" alt="icon" class="h-6 w-6 object-contain" />
      </template>
      <template v-else>
        <component :is="props.icon" />
      </template>
    </span>
    <span class="whitespace-nowrap text-[16px] leading-6">
      {{ props.label }}
    </span>
    <span
      v-if="typeof props.counter === 'number'"
      :class="
        cn(
          'rounded-2xl border px-2 py-[2px] text-xs font-semibold',
          props.active && activeCounterClasses,
        )
      "
    >
      {{ formatNumberToK(props.counter) }}
    </span>
  </button>
</template>
