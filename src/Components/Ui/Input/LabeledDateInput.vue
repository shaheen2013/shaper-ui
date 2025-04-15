<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, toRefs, watchEffect } from "vue";
import { cn } from "../../../Utils/cn";

const props = defineProps({
    class: String,
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    name: { type: String, required: true },
    placeholder: { type: String, default: "" },
    rules: { type: [Object, String], default: null },
    type: { type: String, default: "datetime-local" },
    disabled: { type: Boolean, default: false },
    defaultValue: { type: String, default: "" },
    value: { type: String, default: null },
    min: { type: String, default: "" },
    max: { type: String, default: "" },
    showTimeOnly: { type: Boolean, default: false },
    showDateOnly: { type: Boolean, default: false },
    format: { type: String, default: "YYYY-MM-DDTHH:mm" },
});

const { name, rules } = toRefs(props);
const { value, errorMessage, validate, errors, setValue } = useField(
    name,
    rules,
    {
        initialValue: props.defaultValue ? props.defaultValue : undefined,
    },
);

// Determine the correct input type based on props
const inputType = computed(() => {
    if (props.showTimeOnly) return "time";
    if (props.showDateOnly) return "date";
    return props.type; // Default is datetime-local
});

// Format the datetime for display if needed
const formattedValue = computed(() => {
    return value.value;
});

watchEffect(() => {
    if (props.value) {
        setValue(props.value);
    }
});

// Helper function to get current datetime in the right format for min/max defaults
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Clear the input
const clearInput = () => {
    setValue("");
};
</script>

<template>
    <label
        class="dark:text-white"
        :class="cn('flex w-full flex-col gap-1', props.class)"
    >
        <p
            class="select-none text-sm font-medium leading-5 text-[#344054] dark:text-gray-200"
        >
            {{ props.label }}
            <span class="text-red-500">{{ props.required ? "*" : "" }}</span>
        </p>
        <div class="relative">
            <input
                :type="inputType"
                v-model="value"
                :onblur="validate"
                :placeholder="props.placeholder"
                :disabled="props.disabled"
                :min="props.min"
                :max="props.max"
                :class="
                    cn(
                        'w-full rounded-lg border border-[#D0D5DD] bg-gray-100 px-3.5 py-2.5 text-sm font-normal !outline-none !ring-0 focus:!border-[rgb(115,8,232)] focus:bg-white dark:border-[#61646C] dark:bg-[#333741] dark:text-white focus:dark:bg-gray-800',
                        {
                            'focus: border-red-600 !shadow-md focus:!border-red-600 focus:!shadow-red-300 dark:border-red-600 dark:focus:!shadow-red-900':
                                errorMessage,
                        },
                        {
                            'cursor-not-allowed border-gray-200 text-gray-500':
                                props.disabled,
                        },
                    )
                "
            />
            <!-- clear button -->
            <span
                v-if="value && !props.disabled"
                @click="clearInput"
                class="absolute right-5 top-[50%] translate-y-[-50%] cursor-pointer px-5"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path
                        d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z"
                        fill="#6B7280"
                    />
                </svg>
            </span>
            <slot name="custom_icon"></slot>
        </div>
        <p v-if="errorMessage" class="mt-1 select-none text-xs text-red-500">
            {{ errorMessage }}
        </p>
    </label>
</template>
