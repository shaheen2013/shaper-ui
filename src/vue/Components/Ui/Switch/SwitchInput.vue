<script setup lang="ts">
import { cn } from "./../../../Utils/cn";
import { useField } from "vee-validate";
import { toRefs } from "vue";

const props = defineProps({
    name: { type: String, required: true },
    rules: { type: [Object, String], default: null },
});

const { name, rules } = toRefs(props);
const { value, errorMessage, validate } = useField(name, rules);
</script>

<template>
    <label class="inline-flex cursor-pointer items-center">
        <input
            type="checkbox"
            class="peer sr-only"
            v-model="value"
            :onblur="validate"
        />
        <div
            :class="
                cn(
                    `relative h-6 w-11 ${value ? 'bg-[#09AD5F]' : 'bg-gray-200'} rounded-full dark:${value ? 'bg-[#09AD5F]' : 'bg-gray-700'} transition-colors peer-focus:ring-4 peer-focus:ring-transparent`,
                )
            "
        >
            <div
                :class="
                    cn(
                        `absolute top-0.5 h-5 w-5 rounded-full border border-gray-300 bg-white transition-all ${value ? 'translate-x-5' : 'translate-x-0'} `,
                    )
                "
            ></div>
        </div>
        <p v-if="errorMessage" class="ms-2 text-sm text-red-500">
            {{ errorMessage }}
        </p>
    </label>
</template>
