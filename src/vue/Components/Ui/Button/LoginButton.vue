<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import { onMounted, ref } from "vue";
import { addSessionToUrl } from "../../../Utils/utils";
import Button from "./Button.vue";

const props = defineProps<{
  type?: "reset" | "submit" | "button";
  variant?: "gradient" | "filled" | "gradientOutline" | "danger" | "text";
  size?: "sm" | "md" | "lg";
  class?: string;
  parentClass?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  id?: string;
}>();

const lensix_oauth_redirect_url = usePage().props
  .lensix_oauth_redirect_url as string;

const authUrl = ref<string>(lensix_oauth_redirect_url);

onMounted(async () => {
  authUrl.value = await addSessionToUrl(lensix_oauth_redirect_url);
  setTimeout(async () => {
    authUrl.value = await addSessionToUrl(lensix_oauth_redirect_url);
  }, 2000);
});
</script>

<template>
  <a :href="authUrl">
    <Button v-bind="props"> <slot /></Button
  ></a>
</template>
