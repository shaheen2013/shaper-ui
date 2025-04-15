<script setup lang="ts">
import { useField } from "vee-validate";
import { toRefs } from "vue";
import { cn } from "./../../../Utils/cn";


const props = defineProps<{
    label?: string,
    class?: String,
    name: string,
    checked?: boolean,
    rules?: any,
    required?: boolean,
    value: any,
    varient?: 'default' | 'tick',
    customClick?: () => void,
}>()
const { name, rules } = toRefs(props);
const { value, errorMessage, validate, resetField, setValue } = useField(name, rules);

const handleClick = () => {
    if (props?.customClick) {
        props?.customClick()
    } else {
        if (value.value && value.value === props.value) {  
            resetField()
        } else {
            setValue(props.value)
        }
    }
    
}


</script>

<template>
    <div :class="cn('inline-flex flex-col gap-1', props?.class)" @click="handleClick">
        <div class="inline-flex flex-row gap-4 items-center justify-center">
            <label
                class="inline-flex items-center gap-2 text-[#344054] dark:text-gray-200 text-sm font-medium leading-5 cursor-pointer select-none">
                <div v-if="props?.varient === 'tick'"  :class="cn('h-[24px] w-[24px]')">
                    <svg v-if="value === props.value || (props.checked && !value)" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.2197 8.96967L10.75 13.4393L8.78033 11.4697C8.48744 11.1768 8.01256 11.1768 7.71967 11.4697C7.42678 11.7626 7.42678 12.2374 7.71967 12.5303L10.2197 15.0303C10.5126 15.3232 10.9874 15.3232 11.2803 15.0303L16.2803 10.0303C16.5732 9.73744 16.5732 9.26256 16.2803 8.96967C15.9874 8.67678 15.5126 8.67678 15.2197 8.96967Z"
                            fill="#7E09FF" />
                    </svg>
                    <span v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12.0001 22.0021C17.5238 22.0021 22.0016 17.5243 22.0016 12.0006C22.0016 6.47687 17.5238 1.99902 12.0001 1.99902C6.47638 1.99902 1.99854 6.47687 1.99854 12.0006C1.99854 17.5243 6.47638 22.0021 12.0001 22.0021ZM12.0001 20.5021C7.30481 20.5021 3.49854 16.6959 3.49854 12.0006C3.49854 7.3053 7.30481 3.49902 12.0001 3.49902C16.6954 3.49902 20.5016 7.3053 20.5016 12.0006C20.5016 16.6959 16.6954 20.5021 12.0001 20.5021Z"
                                fill="#61646C" />
                        </svg>
                    </span>
                </div>
                <div v-else  :class="cn('h-5 w-5 border  rounded-full flex items-center justify-center', {
                    'border-lensixPurple-500': value === props.value || (props.checked && !value),
                    'border-gray-400 dark:border-gray-600': !(value === props.value || (props.checked && !value))
                })">
                    <span :class="cn('h-3 w-3 rounded-full', {
                        'bg-lensixPurple-500':  value === props.value || (props.checked && !value)
                    })"></span>
                </div>
                <span v-if="props.label">
                    {{ props.label }}
                </span>
            </label>
        </div>
        <p class="text-red-500 text-xs" v-if="errorMessage">
            {{ errorMessage }}
        </p>
    </div>
</template>
