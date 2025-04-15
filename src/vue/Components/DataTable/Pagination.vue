<script setup lang="ts">
import { computed } from "vue";
import { cn } from "./../../Utils/cn";
import { addParamsToUrl, getCurrentUrlParams } from "./../../Utils/commonUtils";
import { setPaginationQueryData } from "./../../Utils/paginationUtils";

/**-- Component props --*/
const props = defineProps<{
  api: any;
  endPoint: string;
  class?: string;
}>();

console.log("panigated api data is , ", props.api.data.value);
// calculate number of page to show

const pages = computed(() => {
  // const availablePage: {
  //   url: string | null;
  //   label: string;
  //   active: boolean;
  // }[] = [];
  // props.api.data.value?.links?.forEach((link: any) => {
  //   if (!isNaN(Number(link?.label))) {
  //     availablePage.push(link);
  //   }
  // });
  // if (availablePage.length > 6) {
  //   const currentPageNumber =
  //     Number(props?.api?.data?.value?.current_page) || 0;

  //   const currentPages = availablePage;
  //   if (
  //     currentPageNumber >= 4 &&
  //     currentPageNumber + 3 < availablePage.length
  //   ) {
  //     return {
  //       l: [...currentPages.slice(currentPageNumber - 3, currentPageNumber)],
  //       r: [
  //         ...currentPages.slice(
  //           currentPages.length - 3,
  //           currentPages.length + 1,
  //         ),
  //       ],
  //       long: true,
  //     };
  //   } else if (
  //     currentPageNumber >= 4 &&
  //     currentPageNumber + 3 >= availablePage.length
  //   ) {
  //     const sliceWindow = availablePage.slice(
  //       availablePage.length - 6,
  //       availablePage.length,
  //     );
  //     return {
  //       l: [...sliceWindow.slice(0, 3)],
  //       r: [...sliceWindow.slice(3, sliceWindow.length + 1)],
  //       long: false,
  //     };
  //   } else {
  //     return {
  //       l: [...currentPages.slice(0, 3)],
  //       r: [
  //         ...currentPages.slice(
  //           currentPages.length - 3,
  //           currentPages.length + 1,
  //         ),
  //       ],
  //       long: true,
  //     };
  //   }
  // }
  // return {
  //   l: availablePage,
  //   r: [],
  //   long: false,
  // };

  let availablePage: any[] = [];
  props.api.data.value?.links?.forEach((link: any) => {
    if (!isNaN(Number(link?.label)) || link?.label === "...") {
      availablePage.push(link);
    }
  });

  return availablePage;
});

const emit = defineEmits();
const handlePageChange = (page: number) => {
  setPaginationQueryData("page", String(page));
  const params = getCurrentUrlParams();
  const url = addParamsToUrl(props.endPoint, params, {
    page: String(page),
  });
  props.api.callApi(url, "GET");
};

const handlePerPageChange = (per_page: number) => {
  setPaginationQueryData("paginate", String(per_page));
  const params = getCurrentUrlParams();
  const url = addParamsToUrl(props.endPoint, params, {
    paginate: String(per_page),
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
    <!-- left content -->
    <div
      class="custom-res flex w-full items-center justify-between gap-6 py-2 sm:py-0 md:w-auto"
    >
      <div class="flex items-center gap-2 text-[#85888E]">
        <span class="whitespace-nowrap">Rows per page:</span>
        <select
          class="w-[70px] rounded-lg !border-none bg-transparent !py-0 !outline-none focus:!ring-[#85888E]"
          @input="(e: any) => handlePerPageChange(Number(e.target?.value))"
        >
          <option value="5" :selected="props.api.data.value?.per_page === 5">
            5
          </option>
          <option value="10" :selected="props.api.data.value?.per_page === 10">
            10
          </option>
          <option value="15" :selected="props.api.data.value?.per_page === 15">
            15
          </option>
          <option value="20" :selected="props.api.data.value?.per_page === 20">
            20
          </option>
        </select>
      </div>
      <p
        class="flex gap-2 whitespace-nowrap text-sm font-normal text-[#85888E]"
      >
        <span class="font-medium text-[#0C111D] dark:text-white"
          >{{ props.api.data.value?.from || 0 }} -
          {{ props.api.data.value?.to || 0 }}</span
        >
        of
        <span class="font-medium text-[#0C111D] dark:text-white">{{
          props.api.data.value?.total || 0
        }}</span>
      </p>
    </div>
    <!-- right content -->
    <div
      class="flex w-full flex-col items-center justify-between gap-2 border-t pt-2 dark:border-[#43454b] sm:flex-row sm:gap-12 sm:border-0 sm:pt-0 md:w-auto"
    >
      <div class="flex w-auto flex-row justify-between gap-4">
        <button
          @click="
            () =>
              handlePageChange(Number(props.api.data.value?.current_page) - 1)
          "
          type="button"
          :class="
            cn(
              `flex gap-2`,
              props.api.data.value?.prev_page_url === null
                ? 'text-[#85888E] dark:text-[#85888E]'
                : 'text-[#0C111D] dark:text-[#fff]',
            )
          "
          :disabled="props.api.data.value?.prev_page_url === null"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path
                d="M16.5007 9.99935H4.83398M4.83398 9.99935L10.6673 15.8327M4.83398 9.99935L10.6673 4.16602"
                stroke="currentColor"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span> Previous </span>
        </button>
        <button
          @click="
            () =>
              handlePageChange(Number(props.api.data.value?.current_page) + 1)
          "
          type="button"
          :class="
            cn(
              'flex items-center gap-2 sm:hidden',
              props.api.data.value?.next_page_url === null
                ? 'text-[#85888E] dark:text-[#85888E]'
                : 'text-[#0C111D] dark:text-[#fff]',
            )
          "
          :disabled="props.api.data.value?.next_page_url === null"
        >
          <span>Next</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4.16602 9.99935H15.8327M15.8327 9.99935L9.99935 4.16602M15.8327 9.99935L9.99935 15.8327"
                stroke="currentColor"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
      <ul
        class="flex w-full items-center justify-center bg-gray-100 dark:bg-transparent sm:bg-transparent sm:dark:bg-transparent"
      >
        <li v-for="page in pages">
          <button
            @click="
              () => {
                if (page?.label !== '...') {
                  handlePageChange(Number(page.label));
                }
              }
            "
            type="button"
            :class="
              cn(
                'h-[40px] w-[40px] rounded-lg dark:text-white',
                page.active && 'bg-[#F2E6FF] dark:bg-[#333741]',
              )
            "
          >
            {{ page.label }}
          </button>
        </li>
      </ul>
      <button
        @click="
          () => handlePageChange(Number(props.api.data.value?.current_page) + 1)
        "
        type="button"
        :class="
          cn(
            'hidden items-center gap-2 sm:flex',
            props.api.data.value?.next_page_url === null
              ? 'text-[#85888E] dark:text-[#85888E]'
              : 'text-[#0C111D] dark:text-[#fff]',
          )
        "
        :disabled="props.api.data.value?.next_page_url === null"
      >
        <span>Next</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.16602 9.99935H15.8327M15.8327 9.99935L9.99935 4.16602M15.8327 9.99935L9.99935 15.8327"
              stroke="currentColor"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
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
