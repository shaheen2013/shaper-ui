<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "./../Ui/Button/Button.vue";

const props = defineProps<{
  code: string | object;
  language?: string;
}>();

const copied = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

const formattedCode = computed(() => {
  if (typeof props.code === "object") {
    return JSON.stringify(props.code, null, 2);
  }
  return String(props.code);
});

const copyToClipboard = async () => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(formattedCode.value);
    } else {
      // Fallback method using textarea
      const textarea = document.createElement("textarea");
      textarea.value = formattedCode.value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    copied.value = true;

    // Clear existing timeout if any
    if (timeout) {
      clearTimeout(timeout);
    }

    // Reset copied state after 2 seconds
    timeout = setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};
</script>

<template>
  <div
    class="relative max-h-[500px] min-h-20 w-full overflow-y-scroll rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Button
      variant="text"
      parent-class="w-10 ml-auto"
      @click="copyToClipboard"
      type="button"
      class="absolute right-2 top-2 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      :title="copied ? 'Copied!' : 'Copy to clipboard'"
    >
      <svg
        v-if="copied"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-5 w-5"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
        />
      </svg>
    </Button>
    <pre
      class="overflow-x-auto text-wrap text-sm text-gray-800 dark:text-gray-200"
    ><code>{{ formattedCode }}</code></pre>
  </div>
</template>
