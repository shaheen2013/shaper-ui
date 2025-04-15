<script setup lang="ts">
import { onUnmounted } from "vue";
import { setPaginationQueryData } from "./../../Utils/paginationUtils";
import TabButton from "./TabButton.vue";

const props = defineProps<{
  tabData: Tab[];
  modelValue: number | string;
  onChangeTab?: (newData: any) => void;
  tabName?: string;
}>();

const emit = defineEmits();

const changeTab = (tab: Tab) => {
  console.log("idx is", tab);
  setPaginationQueryData(props.tabName || "tab", String(tab.value));
  emit("update:modelValue", tab.value);
  if (props.onChangeTab) {
    props.onChangeTab(tab.value);
  }
};

onUnmounted(() => {
  setPaginationQueryData(props.tabName || "tab", "");
});
</script>
<template>
  <div
    class="flex min-h-fit max-w-full overflow-x-auto border-b border-[#CECFD2] dark:border-[#475467]"
  >
    <TabButton
      v-for="tab in props.tabData"
      :key="tab.value"
      :onClick="() => changeTab(tab)"
      :counter="tab.counter || null"
      :label="tab.label"
      :active="props.modelValue === tab.value"
      :icon="tab.icon"
    >
    </TabButton>
  </div>
</template>
