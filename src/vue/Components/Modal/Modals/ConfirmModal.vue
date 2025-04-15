<script setup lang="ts">
import { v4 } from "uuid";
import Modal from "../Modal.vue";
import Button from "./../../Ui/Button/Button.vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => void;
    isLoading?: boolean;
    error?: string;
    handleModalClose?: () => void;
    confirmButtonText?: string;
  }>(),
  {
    confirmButtonText: "Confirm",
  },
);

const gradient_id = v4();
</script>

<template>
  <Modal
    :open="open"
    :handle-close="() => handleModalClose && handleModalClose()"
  >
    <!-- Header -->
    <div class="flex justify-between dark:border-[#333741]">
      <span class="text-2xl font-semibold leading-8 dark:text-white">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z"
            fill="#FEF0FF"
          />
          <path
            d="M24.9993 29C24.9993 28.4484 24.5522 28.0013 24.0006 28.0013C23.4491 28.0013 23.002 28.4484 23.002 29C23.002 29.5515 23.4491 29.9986 24.0006 29.9986C24.5522 29.9986 24.9993 29.5515 24.9993 29ZM24.7401 21.1467C24.6901 20.7807 24.3761 20.4988 23.9964 20.4991C23.5822 20.4994 23.2467 20.8354 23.247 21.2497L23.2506 25.7513L23.2575 25.853C23.3075 26.2191 23.6215 26.501 24.0012 26.5007C24.4154 26.5003 24.7509 26.1643 24.7506 25.7501L24.747 21.2485L24.7401 21.1467ZM25.9693 15.6589C25.113 14.1111 22.8878 14.1111 22.0316 15.6589L14.2863 29.6604C13.4568 31.16 14.5414 32.9995 16.2552 32.9995H31.7462C33.46 32.9995 34.5446 31.16 33.715 29.6603L25.9693 15.6589ZM23.3442 16.385C23.6296 15.8691 24.3713 15.8691 24.6567 16.385L32.4025 30.3865C32.679 30.8863 32.3175 31.4995 31.7462 31.4995H16.2552C15.6839 31.4995 15.3224 30.8863 15.5989 30.3865L23.3442 16.385Z"
            :fill="`url(#paint0_linear_1279_8191_${gradient_id})`"
          />
          <defs>
            <linearGradient
              :id="`paint0_linear_1279_8191_${gradient_id}`"
              x1="33.9994"
              y1="9.53424"
              x2="5.33768"
              y2="14.3591"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0290374" stop-color="#F16BFF" />
              <stop offset="0.867051" stop-color="#7E09FF" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <button @click="handleModalClose">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4.39705 4.55379L4.46967 4.46967C4.73594 4.2034 5.1526 4.1792 5.44621 4.39705L5.53033 4.46967L12 10.939L18.4697 4.46967C18.7626 4.17678 19.2374 4.17678 19.5303 4.46967C19.8232 4.76256 19.8232 5.23744 19.5303 5.53033L13.061 12L19.5303 18.4697C19.7966 18.7359 19.8208 19.1526 19.6029 19.4462L19.5303 19.5303C19.2641 19.7966 18.8474 19.8208 18.5538 19.6029L18.4697 19.5303L12 13.061L5.53033 19.5303C5.23744 19.8232 4.76256 19.8232 4.46967 19.5303C4.17678 19.2374 4.17678 18.7626 4.46967 18.4697L10.939 12L4.46967 5.53033C4.2034 5.26406 4.1792 4.8474 4.39705 4.55379L4.46967 4.46967L4.39705 4.55379Z"
            fill="#6B7280"
          />
        </svg>
      </button>
    </div>
    <!-- message -->
    <div class="flex flex-col">
      <h3
        class="text-lg font-semibold leading-7 text-[#0C111D] dark:text-white"
      >
        {{ props.title ? props.title : "Title Here" }}
      </h3>
      <p class="text-sm leading-5 text-[#333741] dark:text-[#CECFD2]">
        {{ props.description ? props.description : "Description Here" }}
      </p>
    </div>

    <!-- Form inputs -->
    <div class="flex flex-col gap-3">
      <!-- action button -->
      <div class="flex w-full gap-5">
        <Button
          type="button"
          class="border text-[#0C111D] dark:text-[#94969C]"
          :on-click="handleModalClose"
          variant="text"
          >Cancel</Button
        >
        <Button
          :onClick="onConfirm"
          type="submit"
          :loading="props.isLoading"
          variant="gradient"
          >{{ props.confirmButtonText }}</Button
        >
      </div>
      <!-- error message -->
      <p class="text-xs text-red-500" v-if="props.error">
        {{ props.error }}
      </p>
    </div>
  </Modal>
</template>
