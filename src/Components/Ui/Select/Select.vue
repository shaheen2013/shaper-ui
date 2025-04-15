<script setup lang="ts">
import { useField } from "vee-validate";
import { type Component, computed, onMounted, onUnmounted, ref, toRefs, watch, watchEffect } from "vue";
import { cn } from "../../../Utils/cn";

interface OptionType {
  label: string;
  value: string;
  disabled?: boolean;
  hidden?: boolean;
  icon?: string | Component;
}
const props = withDefaults(
  defineProps<{
    name: string;
    label?: string;
    required?: boolean;
    rules?: Record<string, any> | string;
    placeholder?: string;
    options?: OptionType[];
    loading?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    defaultSelected?: string[] | string;
    onValueChange?: (v: any) => void;
    searchable?: boolean;
    value?: string[] | string;
    onChange?: () => void;
    size?: "normal" | "small";
    class?: string;
  }>(),
  {
    searchable: true,
    size: "normal",
  }
);

const position = ref<{ x: number; y: number; width: number }>({
  x: 0,
  y: 0,
  width: 0,
});

const { name, rules } = toRefs(props);
const { value, errorMessage, validate, setValue } = useField<string[] | string>(name, rules, {
  initialValue: props.multiple ? [] : "",
});

// on value change
watch(
  () => value.value,
  (v) => {
    if (props.onValueChange) {
      props.onValueChange(v);
    }
  }
);

onMounted(() => {
  if (props?.defaultSelected) {
    setValue(props.defaultSelected);
  }
});

const contextOpen = ref<boolean>(false);
const renderOnTop = ref<boolean>(false);
const buttonRef = ref();
const dropdownRef = ref();
const contextMenu = ref();
const iconRef = ref();
const searchText = ref<string | null>(null);
const filteredOptions = computed(() => {
  if (props.options && searchText.value !== null) {
    return props.options.filter((option) => option.label.toLowerCase().includes(searchText.value!.toLowerCase()));
  }
  return props.options ?? [];
});

/** context menu handler */
const onClickHandler = async (e: any) => {
  if (((e.target === buttonRef.value && props.multiple) || (buttonRef.value.contains(e.target) && !props.multiple) || iconRef.value.contains(e.target)) && !props.loading && !props.disabled) {
    const p = new Promise<void>((resolve) => {
      contextOpen.value = !contextOpen.value;
      resolve();
    });
    await p;
    // update context position
    updatePosition();
    const searchInput1 = document.querySelector(".search-input-1") as HTMLInputElement;
    if (searchInput1) {
      searchInput1.focus();
    }
    const searchInput2 = document.querySelector(".search-input-2") as HTMLInputElement;
    if (searchInput2) {
      searchInput2.focus();
    }
  }
};

// update context position
const updatePosition = async () => {
  if (dropdownRef.value) {
    const rect = dropdownRef.value?.getBoundingClientRect();

    const menuRect = contextMenu.value?.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const spaceTop = rect.top;
    const spaceBottom = viewportHeight - rect.bottom;

    let y = rect.bottom + window.scrollY;

    // Adjust Y (Above or Below)
    if (spaceBottom < menuRect?.height && spaceTop >= menuRect?.height) {
      y = rect.top + window.scrollY - menuRect?.height;
      renderOnTop.value = true;
    } else {
      renderOnTop.value = false;
    }

    position.value.x = rect.left + window.scrollX;
    // position.value.y = rect.y + rect.height + window.scrollY;
    position.value.y = y;
    position.value.width = rect.width;
  }
};

onMounted(() => {
  // Listen for clicks
  if (typeof document !== "undefined") {
    document.addEventListener("click", (e: Event) => {
      if (dropdownRef.value && !dropdownRef.value?.contains(e.target as Node) && !contextMenu.value?.contains(e.target)) {
        contextOpen.value = false;
      }
    });

    // Listen for scroll
    document.addEventListener("scroll", updatePosition, true);
  }
});

onUnmounted(() => {
  document.removeEventListener("scroll", updatePosition, true);
});

const toggleSelect = (option: OptionType) => {
  if (props.onChange) {
    props.onChange();
  }
  if (typeof value.value !== "string" && props.multiple) {
    const index = value?.value?.findIndex((r) => r === option?.value);
    if (index !== -1) {
      const newValue = [...value.value];
      newValue.splice(index, 1);
      setValue(newValue);
    } else {
      setValue([...value?.value, option?.value]);
      // Update the position
      updatePosition();
    }
    validate();
  } else {
    setValue(option?.value);
    contextOpen.value = false;
  }
};

const onRemove = (v: string) => {
  const newValue = [...value.value];
  const index = newValue.findIndex((r) => r === v);
  if (index !== -1) {
    newValue.splice(index, 1);
  }
  setValue(newValue);
};

watch(
  () => props.multiple,
  (newVal) => {
    if (newVal) {
      setValue([]);
    } else {
      setValue("");
    }
  }
);
watchEffect(() => {
  if (props.value) {
    setValue(props.value);
  }
});
</script>
<template>
  <div :class="cn('select flex w-full flex-col gap-1', props.class)">
    <p v-if="props.label" class="text-sm font-medium leading-5 text-[#344054] dark:text-gray-200">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">{{ "*" }}</span>
    </p>
    <!-- Trigger button -->
    <div class="flex flex-row gap-3" ref="dropdownRef">
      <div class="relative flex flex-grow">
        <!-- for multiselect -->
        <button
          type="button"
          ref="buttonRef"
          @click="onClickHandler"
          :class="
            cn(
              'relative flex w-full flex-wrap gap-2 overflow-hidden rounded-lg border border-[#CECFD2] bg-gray-100 pl-3.5 pr-8 text-left text-sm font-normal capitalize text-[#6B7280] !outline-none !ring-0 focus:border-[#CECFD2] dark:border-[#61646C] dark:bg-[#333741] dark:text-[#94969C]',
              {
                'border-red-500 dark:border-red-500': errorMessage,
              },
              { 'py-2.5': props.size === 'normal' },
              { 'py-[3px]': props.size === 'small' },
              { 'gap-2': props.multiple },
              {
                'cursor-not-allowed bg-[#F9FAFB]': props.disabled,
              }
            )
          "
        >
          <div v-if="value?.length > 0 && props.multiple" v-for="v in value" class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-3 transition-all duration-300 hover:scale-125 dark:bg-[#2d3038]">
            <span>
              {{ options && options[options.findIndex((o) => o.value === v)]?.label }}
            </span>
            <span class="h-4 w-4" @click="() => onRemove(v)">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 25" fill="none">
                <path d="M18 6.5L6 18.5M6 6.5L18 18.5" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <!-- For single select -->
          <div v-if="!props.multiple && (typeof value === 'string' || typeof value === 'number')">
            {{ props.options?.find((item) => item.value === value)?.label }}
          </div>
          <slot v-if="(value && value.length <= 0) || !value">
            {{ placeholder || "Select options.." }}
          </slot>
          <div ref="iconRef" v-if="!props.loading" class="absolute right-3 top-[50%] inline-flex h-4 w-4 translate-y-[-50%] text-[#6B7280]">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none">
              <path d="M13.794 5.73271C14.0797 6.03263 14.0681 6.50737 13.7682 6.79306L8.51776 11.7944C8.22809 12.0703 7.77285 12.0703 7.48318 11.7944L2.23271 6.79306C1.93279 6.50737 1.92125 6.03263 2.20694 5.73271C2.49264 5.43279 2.96737 5.42125 3.26729 5.70694L8.00047 10.2155L12.7336 5.70694C13.0336 5.42125 13.5083 5.43279 13.794 5.73271Z" fill="currentColor" />
            </svg>
          </div>

          <span v-else class="absolute right-3 top-[50%] h-[20px] w-[20px] translate-y-[-50%]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" :class="cn('animate-spin text-purple-700 dark:text-purple-500')">
              <path fill="currentColor" d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
            </svg>
          </span>
        </button>

        <!-- Context menu -->
        <transition>
          <Teleport to="body">
            <div ref="contextMenu" v-if="contextOpen" class="select absolute z-[999] mt-[2px] w-full overflow-hidden rounded-lg border border-[#CECFD2] bg-[#F9FAFB] py-2 transition-all duration-0 ease-in-out dark:border-[#61646C] dark:bg-[#333741]" :style="`left: ${position.x}px;top: ${position.y}px;width: ${position.width}px`">
              <!-- search for bottom render -->
              <div v-if="searchable && !renderOnTop" class="w-full border-b px-4 pb-2 dark:border-[#94969C]">
                <input v-model="searchText" placeholder="Search..." class="search-input-1 h-8 w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm outline-none transition-all duration-300 focus:border-none focus:border-indigo-500 focus:ring-indigo-600 dark:bg-[#282a31] dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-600" />
              </div>
              <!-- options -->
              <div
                :class="
                  cn(' w-full overflow-y-auto flex flex-col items-end', {
                    'h-[150px]': renderOnTop,
                    'max-h-[150px]': !renderOnTop,
                  })
                "
              >
                <!-- default no data option -->
                <div
                  v-if="filteredOptions.length !== 0 && props.multiple && !searchText"
                  @click="
                    () => {
                      if (!props?.multiple)
                        toggleSelect({
                          label: placeholder || 'Select an option',
                          value: '',
                        });
                    }
                  "
                  :class="
                    cn('flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F5F5F6] dark:text-white dark:hover:bg-[#2c2f38] w-full', {
                      'bg-gray-200 dark:bg-[#1F242F]': value === '',
                    })
                  "
                >
                  <div
                    :class="
                      cn('flex w-full cursor-pointer items-center gap-3', {
                        'cursor-not-allowed text-gray-400 dark:text-gray-500': props.multiple,
                      })
                    "
                  >
                    <span v-if="props.multiple" :class="cn('h-4 w-4 rounded bg-neutral-300 text-transparent dark:bg-neutral-600')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>

                    <span v-if="!searchText">{{ placeholder || "Select an option" }}</span>
                  </div>
                </div>
                <!-- available options -->
                <div
                  v-if="filteredOptions.length > 0"
                  v-for="(option, idx) in filteredOptions"
                  @click="
                    () => {
                      if (!option.disabled) {
                        toggleSelect(option);
                      }
                    }
                  "
                  :class="
                    cn(
                      'flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F5F5F6] dark:text-white dark:hover:bg-[#2c2f38] w-full',
                      {
                        'bg-gray-200 dark:bg-[#1F242F]': option.value === value,
                      },
                      {
                        'pointer-events-none bg-gray-300': option.disabled,
                      },
                      {
                        hidden: option.hidden,
                      }
                    )
                  "
                >
                  <div class="flex w-full cursor-pointer items-center gap-3">
                    <span
                      v-if="props.multiple"
                      type="checkbox"
                      :class="
                        cn(
                          'h-4 w-4 rounded focus:ring-2',
                          {
                            'bg-[#7E09FF] text-white': typeof value !== 'string' && value?.findIndex((v) => v === option?.value) !== -1,
                          },
                          {
                            'bg-transparent text-transparent': typeof value !== 'string' && value?.findIndex((v) => v === option?.value) === -1,
                          }
                        )
                      "
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <img v-if="option.icon && typeof option.icon === 'string'" class="h-5 w-5 rounded-full object-contain" :src="option.icon" alt="" />
                    <component v-if="option.icon && typeof option.icon === 'object'" :is="option.icon" />
                    <slot name="list_img" :data="option"></slot>
                    <span>{{ option.label }}</span>
                  </div>
                </div>
                <!-- no option design -->
                <div v-if="filteredOptions.length === 0" :class="cn('flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F5F5F6] dark:text-white dark:hover:bg-[#2c2f38] w-full')">
                  <div class="flex w-full cursor-pointer items-center gap-3">No Options Found!!</div>
                </div>
              </div>

              <!-- search  for top render-->
              <div v-if="searchable && renderOnTop" class="w-full border-t px-4 pt-2 dark:border-[#94969C] mt-4">
                <input v-model="searchText" placeholder="Search..." class="search-input-2 h-8 w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm outline-none transition-all duration-300 focus:border-none focus:border-indigo-500 focus:ring-indigo-600 dark:bg-[#282a31] dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-600" />
              </div>
            </div>
          </Teleport>
        </transition>
      </div>
    </div>
    <!-- Error message -->
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
