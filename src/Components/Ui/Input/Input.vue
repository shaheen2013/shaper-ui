<script setup lang="ts">
import { useField } from "vee-validate";
import { toRefs } from "vue";

const props = defineProps({
    name: { type: String, required: true },
    placeholder: { type: String, default: "" },
    icon: { type: String, default: null },
    rules: { type: [Object, String], default: null },
});

const { name, rules } = toRefs(props);
const { value, errorMessage, validate } = useField(name, rules);
</script>

<template>
    <div>
        <div class="relative">
            <input
                :onblur="validate"
                v-model="value"
                :class="[
                    'h-[40px] w-full rounded-lg border-[1px] border-gray-300 py-6 pl-12 pr-6 text-[16px] focus:border-[#3862F9] focus-visible:outline-none',
                    icon ? '' : 'px-4',
                    errorMessage ? 'border-red-600 focus:border-red-600' : '',
                ]"
                :placeholder="placeholder"
            />
            <img
                v-if="icon"
                :src="icon"
                alt="svg"
                class="absolute left-4 top-1/2 -translate-y-1/2"
            />
        </div>
        <p>Errors</p>
        <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
        </p>
    </div>
</template>
