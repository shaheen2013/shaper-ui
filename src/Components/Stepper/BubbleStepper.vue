<script setup lang="ts">
import { ref, watch } from "vue";
import { cn } from "./../../Utils/cn";
import Button from "../Ui/Button/Button.vue";

const props = defineProps<{
  totalSteps: number;
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const currentStep = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => (currentStep.value = newValue),
);

const updateStep = (step: number) => {
  if (step >= 1 && step <= props.totalSteps) {
    emit("update:modelValue", step);
  }
};
</script>

<template>
  <div class="flex w-full justify-between">
    <Button
      :onClick="() => updateStep(currentStep - 1)"
      parent-class="w-fit p-0"
      class="px-1"
      variant="text"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_4360_39623)">
          <path
            d="M2.29642 10L10.7875 1.27302C11.0764 0.976139 11.0699 0.50131 10.773 0.212456C10.4761 -0.0763979 10.0013 -0.0698933 9.71246 0.226984L0.712456 9.47698C0.429181 9.76813 0.429181 10.2319 0.712456 10.523L9.71246 19.773C10.0013 20.0699 10.4761 20.0764 10.773 19.7875C11.0699 19.4987 11.0764 19.0239 10.7875 18.727L2.29642 10Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_4360_39623">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </Button>
    <div class="flex items-center justify-center gap-2">
      <div
        v-for="(step, index) in props.totalSteps"
        :key="index"
        :class="
          cn(
            'h-2 w-2 cursor-pointer rounded-full transition-all duration-300',
            {
              'h-3 w-3 bg-gradient-to-r from-[#7E09FF] to-[#F16BFF]':
                index === currentStep - 1,
              'bg-gray-300 dark:bg-white': index !== currentStep - 1,
            },
          )
        "
        @click="updateStep(index + 1)"
      />
    </div>
    <Button
      :onClick="() => updateStep(currentStep + 1)"
      variant="text"
      parent-class="w-fit p-0"
      class="px-1"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.7036 10L9.21246 1.27302C8.9236 0.976139 8.93011 0.50131 9.22698 0.212456C9.52386 -0.0763979 9.99869 -0.0698933 10.2875 0.226984L19.2875 9.47698C19.5708 9.76813 19.5708 10.2319 19.2875 10.523L10.2875 19.773C9.99869 20.0699 9.52386 20.0764 9.22698 19.7875C8.93011 19.4987 8.9236 19.0239 9.21246 18.727L17.7036 10Z"
          fill="white"
        />
      </svg>
    </Button>
  </div>
</template>
