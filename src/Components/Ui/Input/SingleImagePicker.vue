<script setup lang="ts">
import { useField } from "vee-validate";
import { onMounted, ref, toRefs } from "vue";
import { cn } from "./../../../Utils/cn";

const props = defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  name: { type: String, required: true },
  rules: { type: [Object, String], default: null },
  class: { type: String, default: "" },
});

const selectedImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const { name, rules } = toRefs(props);
const { value, errorMessage, validate } = useField(name, rules);

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (file) {
    console.log("image value is", value.value);
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
};

onMounted(() => {
  if (typeof value.value === "string") {
    imagePreview.value = value.value;
    value.value = null;
  }
});
</script>

<template>
  <div
    :class="cn('relative flex w-fit flex-col items-center gap-2', props.class)"
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
      v-if="imagePreview"
      class="h-24 w-24 overflow-hidden rounded-full border border-dashed border-gray-300"
    >
      <img
        :src="imagePreview"
        alt="Selected Image"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Picker Button -->
    <label
      class="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-dashed border-gray-300 text-sm text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-700"
      v-if="!imagePreview"
    >
      <!-- File Input -->
      <input
        type="file"
        accept="image/*"
        :name="name"
        class="hidden"
        @change="handleImageChange"
      />
      Pick an Image
    </label>

    <button
      v-if="imagePreview"
      type="button"
      class="absolute -right-2 bottom-14 rounded-full bg-white p-1 shadow-md shadow-black"
      @click="handleImagePreviewRemove"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="red"
        class="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </button>
  </div>
  <p class="text-xs text-red-600" v-if="errorMessage">{{ errorMessage }}</p>
</template>
