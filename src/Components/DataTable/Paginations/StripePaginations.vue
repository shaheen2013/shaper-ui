<script setup lang="ts">
import { cn } from "./../../../Utils/cn";
import {
  addParamsToUrl,
  getCurrentUrlParams,
} from "./../../../Utils/commonUtils";

/**-- Component props --*/
const props = defineProps<{
  api: any;
  endPoint: string;
  class?: string;
}>();

const emit = defineEmits();

const lastIds: string[] = [];

const loadMore = () => {
  if (!Boolean(props.api.data.value?.last_id)) return;

  lastIds.push(props.api.data.value?.last_id);

  const params = getCurrentUrlParams();
  const url = addParamsToUrl(props.endPoint, params, {
    starting_after: lastIds[lastIds.length - 1],
  });
  props.api.callApi(url, "GET");
};
</script>

<template>
  <div
    :class="
      cn(
        `flex w-full flex-col items-center justify-between gap-3 px-4 py-3.5 md:flex-row`,
        props.class,
      )
    "
  >
    <div
      class="flex w-full flex-col items-center justify-between gap-2 border-t border-gray-300 pt-2 dark:border-gray-600 sm:gap-12 sm:border-0 sm:pt-0"
    >
      <button
        @click="loadMore"
        type="button"
        :disabled="
          !props?.api?.data.value?.has_more || props?.api?.isLoading.value
        "
        :class="
          cn(
            'flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-2 dark:border-gray-700 dark:text-gray-400',
            {
              'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-600':
                !props?.api?.data.value?.has_more,
            },
          )
        "
      >
        <span>Load more</span>

        <svg
          v-if="props?.api?.isLoading.value"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          :class="cn('h-5 w-5 animate-spin')"
        >
          <path
            fill="currentColor"
            d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<style scoped>
.custom-res {
  flex-direction: column;
}
@media (min-width: 400px) {
  .custom-res {
    flex-direction: row;
  }
}
</style>
