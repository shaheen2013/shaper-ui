<script setup lang="ts">
import { useField } from "vee-validate";
import { onMounted, Ref, ref, toRefs, watch } from "vue";
import DeleteIcon from "../../Icons/DeleteIcon.vue";
import ImagePlusIcon from "../../Icons/ImagePlusIcon.vue";
import { cn } from "./../../../Utils/cn";
import ImagePlusIconSVG from "./../../Icons/ImagePlusIcon.svg";

const props = withDefaults(
  defineProps<{
    label?: string;
    required?: boolean;
    name: string;
    rules?: Record<string, any> | string;
    backgroundColor?: string;
    height?: string;
    width?: string;
    preview?: boolean;
  }>(),
  {
    label: "Select Image",
    backgroundColor: "#F3F4F6",
    height: "150px",
    width: "150px",
    preview: true,
  },
);

const inputRef = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>;

const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const { name, rules } = toRefs(props);
const { value, errorMessage, validate, setValue } = useField(name, rules);

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (file) {
    selectedImage.value = file;
    imagePreview.value = URL.createObjectURL(file);
    value.value = file;
  } else {
    selectedImage.value = null;
    imagePreview.value = null;
  }
}

const handleImagePreviewRemove = () => {
  if (imagePreview) {
    imagePreview.value = null;
  }
  if (selectedImage) {
    selectedImage.value = null;
  }
  setTimeout(() => {
    setValue(null);
  }, 0);
};

function getContrastColor(color: string) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return "black";
  ctx.fillStyle = color;
  const hex = ctx.fillStyle.match(/^#([0-9a-f]{6})$/i);
  if (!hex) return "black";
  const r = parseInt(hex[1].substr(0, 2), 16);
  const g = parseInt(hex[1].substr(2, 2), 16);
  const b = parseInt(hex[1].substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

onMounted(() => {
  if (typeof value.value === "string") {
    imagePreview.value = value.value;
    value.value = null;
  }
});

watch(
  () => value.value,
  () => {
    if (typeof value.value === "string") {
      imagePreview.value = value.value;
      value.value = null;
      if (inputRef.value) {
        inputRef.value.value = "";
      }
    }
  },
);
</script>

<template>
  <!-- {{ imagePreview }} -->
  <label
    @click="(e) => imagePreview && e.preventDefault()"
    class="flex w-full cursor-pointer flex-col items-start justify-end gap-2"
  >
    <!-- Label -->
    <p
      class="text-center text-sm font-medium leading-5 text-[#344054] dark:text-zinc-200"
    >
      {{ label }}
      <span class="text-red-500">{{ required ? "*" : "" }}</span>
    </p>
    <!-- Image Preview -->
    <div
      v-if="preview"
      class="relative flex w-full items-center justify-center rounded-lg border dark:border-lensixGray-700"
      :style="{ backgroundColor: backgroundColor }"
    >
      <slot
        name="preview"
        :data="{ preview: imagePreview, default: ImagePlusIconSVG }"
      >
        <div :style="{ height: props.height, width: props.width }">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            class="h-full w-full object-cover text-white"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center py-6"
            :style="{
              color: getContrastColor(props.backgroundColor),
            }"
          >
            <ImagePlusIcon />
          </div>
        </div>
      </slot>
      <button
        v-if="imagePreview"
        @click.prevent="handleImagePreviewRemove"
        class="absolute right-0 top-0 m-2 flex h-7 w-7 items-center justify-center rounded-lg border bg-white p-1 text-red-600 dark:border-lensixGray-700"
      >
        <DeleteIcon />
      </button>
    </div>

    <!-- Picker Button -->
    <div
      class="flex w-full cursor-pointer items-center text-sm text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-700"
    >
      <!-- File Input -->
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        :onblur="validate"
        :name="name"
        :class="
          cn(
            'w-full rounded-lg border focus:outline-none dark:border-lensixGray-700',
            {
              'cursor-not-allowed opacity-60': imagePreview,
            },
          )
        "
        @change="handleImageChange"
      />
    </div>
  </label>
  <p class="text-xs text-red-600" v-if="errorMessage">{{ errorMessage }}</p>
</template>
