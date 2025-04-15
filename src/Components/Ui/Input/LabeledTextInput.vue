<script setup lang="ts">
import TextInput from "./TextInput.vue";
import { cn } from "./../../../Utils/cn";

const props = defineProps({
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    class: String,
    name: { type: String, required: true },
    placeholder: { type: String, default: "" },
    rules: { type: [Object, String], default: null },
    passwordInput: { type: Boolean, default: false },
    type: { type: String, default: "text" },
    disabled: { type: Boolean, default: false },
    step: { type: String, default: "any" },
    defaultValue: { type: String, default: "" },
});
</script>

<template>
    <label :class="cn('flex w-full flex-col gap-1', props.class )">
        <p
            class="select-none text-sm font-medium leading-5 text-[#344054] dark:text-gray-200"
        >
            {{ props.label }}
            <span class="text-red-500">{{ props.required ? "*" : "" }}</span>
        </p>
        <TextInput
            :placeholder="props.placeholder"
            :rules="props.rules"
            :name="props.name"
            :passwordInput="props.passwordInput"
            :type="props.type"
            :disabled="props.disabled"
            :step="props.step"
            :defaultValue="props.defaultValue"
            class="h-full"
        >
         <template #custom_icon>    
            <slot name="custom_icon">

            </slot>
         </template>
        </TextInput>
    </label>
</template>

