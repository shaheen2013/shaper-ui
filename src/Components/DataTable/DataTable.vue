<script setup lang="ts">
import { router } from "@inertiajs/vue3";
import {
  type Component,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useApi } from "./../../Composables/Fetchers/useApi";
import { cn } from "./../../Utils/cn";
import { addParamsToUrl, getCurrentUrlParams } from "./../../Utils/commonUtils";
import {
  setPaginationQueryData,
  setQueryParams,
} from "./../../Utils/paginationUtils";
import DataNotFoundIcon from "../Icons/DataNotFoundIcon.vue";
import Skelaton from "../Skelaton/Skelaton.vue";
import Button from "../Ui/Button/Button.vue";
import DataTableActionHeader from "./DataTableActionHeader.vue";
import Pagination from "./Pagination.vue";

export type TableDataType = {
  current_page: number;
  data: any[];
  last_page: number;
  from: number;
  to: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
};
interface TableHeader {
  name: string;
  key: string;
  style?: string;
  sort?: boolean;
  data?: Component;
}

const props = withDefaults(
  defineProps<{
    tableName: string;
    header: TableHeader[];
    tableClass?: string;
    modelValue: string;
    noPagination?: boolean;
    noActionHeader?: boolean;
    noSkeletonOnRefetch?: boolean;
    skeletonBarHeight?: number;
    autoRefetch?: boolean;
    refetchIntervalTime?: number;
    searchable?: boolean;
    append?: boolean;
  }>(),
  {
    searchable: true,
  },
);

const emit = defineEmits();
const sortColumn = ref("created_at");
const sortDirection = ref("desc");
const viewMode = ref<"list" | "card">("list");

const setViewMode = (mode: "list" | "card") => {
  viewMode.value = mode;
};

const sortHandler = (key: any) => {
  const params = getCurrentUrlParams();
  const sort_direction = params.sort_direction === "desc" ? "asc" : "desc";
  setQueryParams("sort_direction", sort_direction);
  setQueryParams("sort_column", key);
  sortColumn.value = key;
  sortDirection.value = sort_direction;
  const url = addParamsToUrl(props.modelValue, params);
  emit("update:modelValue", url);
};

const handleSearchInputChange = (value: any) => {
  setPaginationQueryData("search", String(value));
  setPaginationQueryData("page", String(1));
  const params = getCurrentUrlParams();
  const url = addParamsToUrl(props.modelValue, params, {
    search: String(value),
  });
  emit("update:modelValue", url);
};

const api = useApi();
const data = ref<any[]>([]);

watch(
  () => api.data.value,
  (d: any) => {
    if (props?.append) {
      if (d?.data) {
        data.value = [...data.value, ...d?.data];
      }
    } else {
      data.value = d?.data;
    }
  },
);

watchEffect(() => {
  const params = getCurrentUrlParams();
  const url = addParamsToUrl(props.modelValue, params);
  api.callApi(`${url}`, "GET", null);
});

const showSkelaton = ref<boolean>(true);

const handeRefetch = async (revisit: boolean) => {
  showSkelaton.value = false;
  if (!revisit) {
    await api.refetch();
    showSkelaton.value = true;
  } else {
    const params = new URLSearchParams(window.location.search);
    router.visit(`${window.location.href.split("?")[0]}?${params}`, {
      only: ["onlyTrashed", "total"],
      preserveState: false,
    });
  }
};

const expandedRow = ref(-1);

/* Auto refetch logic */
let interval: any = null;
onMounted(() => {
  if (props?.autoRefetch) {
    interval = setInterval(
      async () => {
        showSkelaton.value = false;
        await api.refetch();
        showSkelaton.value = true;
      },
      (props?.refetchIntervalTime || 30) * 1000,
    );
  }
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<template>
  <div
    :class="
      cn(
        'flex h-full w-full flex-col justify-between overflow-auto rounded-lg border dark:border-[#333741] dark:bg-[#0C111D] sm:h-full sm:overflow-hidden',
        props.tableClass,
      )
    "
  >
    <slot name="table_data" :data="{ rows: data }"></slot>
    <div
      class="flex h-auto w-full flex-grow flex-col overflow-auto sm:h-full sm:overflow-hidden"
    >
      <DataTableActionHeader
        :searchable="props.searchable"
        v-if="!props.noActionHeader"
        :table-name="props.tableName"
        :on-search-input-change="handleSearchInputChange"
      >
        <template #top_header_action_button="">
          <slot
            name="top_header_action_button"
            :data="{ handeRefetch, viewMode, setViewMode, api }"
          ></slot>
        </template>
      </DataTableActionHeader>
      <div
        :class="cn('flex h-full min-h-[400px] w-full flex-col overflow-auto')"
      >
        <slot
          name="custom_body"
          :data="{
            header: props?.header,
            rows: data,
            handeRefetch: handeRefetch,
            isLoading: api.isLoading.value,
          }"
        >
          <!-- list view -->
          <template v-if="viewMode === 'list'">
            <table :class="cn('w-full')">
              <thead>
                <tr
                  class="bg-[#F3F4F6] text-sm font-medium leading-5 text-[#111928] dark:bg-[#1F242F] dark:text-white"
                >
                  <th
                    v-for="(head, idx) in props.header"
                    :key="idx"
                    class="p-4"
                    :style="head.style"
                  >
                    <button
                      type="button"
                      :class="cn('flex w-full items-center gap-1 capitalize')"
                      @click="
                        () => {
                          head.sort && sortHandler(head.key);
                        }
                      "
                    >
                      <slot
                        :name="`header_${head.key}`"
                        :data="{ data: head, idx: idx, api }"
                      >
                        <span>
                          {{ head.name }}
                        </span>
                        <span
                          v-if="head.sort"
                          class="text-[#747b8a] dark:text-white"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <polygon
                              points="3.11,6.25 10.89,6.25 7,1.75 "
                              fill="currentColor"
                              :class="
                                sortColumn === head?.key &&
                                sortDirection === 'asc' &&
                                'text-[#8F18FF]'
                              "
                            ></polygon>
                            <polygon
                              points="7,12.25 10.89,7.75 3.11,7.75 "
                              fill="currentColor"
                              :class="
                                sortColumn === head?.key &&
                                sortDirection === 'desc' &&
                                'text-[#8F18FF]'
                              "
                            ></polygon>
                          </svg>
                        </span>
                      </slot>
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody v-if="!api.isLoading.value">
                <template
                  v-if="data && data.length > 0"
                  v-for="(row, i1) in data"
                  :key="i1"
                >
                  <tr
                    :class="[
                      i1 % 2 === 0
                        ? 'bg-white dark:bg-transparent'
                        : 'bg-[#F3F4F6] dark:bg-[#1F242F]',
                      'marker dark:text-white',
                    ]"
                  >
                    <td
                      v-for="(h, i2) in props.header"
                      :key="i1 + i2"
                      class="p-4"
                    >
                      <slot
                        :name="h.key"
                        :data="{
                          row: {
                            ...row,
                            serial: (Number(api.data.value?.from) || 0) + i1,
                          },
                          handeRefetch,
                          expandedRow: expandedRow,
                          setExpandedRow: () => {
                            let serial =
                              (Number(api.data.value?.from) || 0) + i1;
                            if (serial === expandedRow) {
                              expandedRow = -1;
                            } else {
                              expandedRow = serial;
                            }
                          },
                        }"
                      >
                        <span
                          v-if="
                            typeof row[h.key] === 'string' ||
                            typeof row[h.key] === 'number'
                          "
                        >
                          {{ row[h.key] }}
                        </span>
                        <component v-else :is="row[h.key]" />
                      </slot>
                    </td>
                  </tr>
                  <tr>
                    <td :colspan="props?.header.length || 0">
                      <slot
                        name="expanded_row"
                        :data="{
                          row: {
                            ...row,
                            serial: (Number(api.data.value?.from) || 0) + i1,
                          },
                          handeRefetch,
                          expandedRow: expandedRow,
                          setExpandedRow: () => {
                            expandedRow = !expandedRow;
                          },
                        }"
                      ></slot>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
          <!-- card view -->
          <template v-else>
            <div class="w-full">
              <div
                v-if="!api.isLoading.value"
                class="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 xl:grid-cols-3"
              >
                <slot
                  v-for="(row, i1) in data"
                  :key="i1"
                  name="card_view"
                  :data="{
                    row: { ...row, serial: Number(api.data.value?.from) + i1 },
                    handeRefetch,
                  }"
                >
                  <div class="h-full w-full border dark:text-white">
                    You have to provide custom design
                  </div>
                </slot>
              </div>
            </div>
          </template>
        </slot>
        <slot
          name="custom_skeleton"
          :data="{
            isLoading: api.isLoading.value,
            noSkaletonOnRefetch: props.noSkeletonOnRefetch,
            rows: data,
            viewMode,
          }"
        >
          <Skelaton
            class="p-4"
            v-if="
              (api.isLoading.value ||
                (!props.noSkeletonOnRefetch && api.isRefetching.value)) &&
              showSkelaton
            "
            :n="paginationData?.per_page || 10"
            :barHeight="props?.skeletonBarHeight"
          >
          </Skelaton>
        </slot>
        <div
          v-if="data && data.length <= 0 && !api.isLoading.value"
          class="flex h-full w-full flex-col items-center justify-center overflow-hidden"
        >
          <slot name="not_found">
            <span>
              <DataNotFoundIcon />
            </span>
            <div>
              <slot
                name="data_empty_action_button"
                :data="{ handeRefetch, api }"
              >
                <Button class="gap-2">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10.5 2.75C10.5 2.33579 10.1642 2 9.75 2C9.33579 2 9 2.33579 9 2.75V9H2.75C2.33579 9 2 9.33579 2 9.75C2 10.1642 2.33579 10.5 2.75 10.5H9V16.75C9 17.1642 9.33579 17.5 9.75 17.5C10.1642 17.5 10.5 17.1642 10.5 16.75V10.5H16.75C17.1642 10.5 17.5 10.1642 17.5 9.75C17.5 9.33579 17.1642 9 16.75 9H10.5V2.75Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <span> Create New Row </span>
                </Button>
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </div>
    <slot
      v-if="!props.noPagination"
      name="pagination"
      :data="{ api, endPoint: props.modelValue }"
    >
      <Pagination :api="api" :endPoint="props.modelValue" />
    </slot>
  </div>
</template>
