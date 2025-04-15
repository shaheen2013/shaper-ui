<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, ref, toRefs, watchEffect } from "vue";
import { cn } from "./../../../Utils/cn";

import countries from "./countriesData";

type CountryType = {
  name: string;
  code: string;
  flag: string;
};

const props = defineProps({
  class: String,
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  name: { type: String, required: true },
  placeholder: { type: String, default: "Enter phone number" },
  rules: { type: [Object, String], default: null },
});
const drowdownButtonRef = ref();
const searchInputRef = ref();
const showDropdown = ref(false);
const isInputChanged = ref(false);
const countrySearchText = ref("");

const filteredCountries = computed(() => {
  const search = countrySearchText.value;
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase()),
  );
});

const { name, rules } = toRefs(props);
const { value, errorMessage, validate } = useField(name, rules);

const selectedCountry = ref<CountryType>(countries[183]);
const phoneNumber = ref("");

const fullPhoneNumber = computed(
  () => `${selectedCountry.value.code} ${phoneNumber.value}`,
);

const setSelectedCountry = (country: any) => {
  selectedCountry.value = country;
};

const handleDropDownToggle = () => {
  showDropdown.value = !showDropdown.value;
  console.log("button clicks");
};

// const handleClickOutside = (event: MouseEvent) => {
//     const element = drowdownButtonRef.value;
//     const searchInputElement = searchInputRef.value;
//     if (
//         !element.contains(event.target) &&
//         !searchInputElement.contains(event.target)
//     ) {
//         showDropdown.value = false;
//         countrySearchText.value = "";
//     }
// };

watchEffect(() => {
  console.log("value of value", value.value);
  if (isInputChanged.value) {
    value.value = fullPhoneNumber.value;
  } else {
    if (value.value && typeof value.value === "string") {
      const fullPhoneNumberArray = value.value.split(" ");
      phoneNumber.value = fullPhoneNumberArray[1];
      const selectedCountry = countries.find(
        (country) => country.code === fullPhoneNumberArray[0],
      );
      phoneNumber.value = fullPhoneNumberArray[1];
      setSelectedCountry(selectedCountry || countries[0]);
    }
  }
});

// onMounted(() => {
//     document.addEventListener("click", handleClickOutside);
// });
// onUnmounted(() => {
//     document.removeEventListener("click", handleClickOutside);
// });
</script>

<template>
  <div class="flex flex-col gap-1">
    <p
      class="select-none text-sm font-medium leading-5 text-[#344054] dark:text-zinc-200"
    >
      {{ label }}
      <span class="text-red-500">{{ required ? "*" : "" }}</span>
    </p>
    <div>
      <div class="relative flex items-center">
        <div
          class="absolute flex cursor-pointer items-center border-r pr-1 dark:text-white"
          ref="drowdownButtonRef"
          @click="handleDropDownToggle"
        >
          <button
            class="flex items-center gap-1 py-2 pl-3 pr-2 text-sm"
            type="button"
          >
            <img
              :src="selectedCountry.flag"
              alt="Flag"
              class="h-5 w-5 rounded-full object-cover"
            />
            <span class="text-[#344054] dark:text-zinc-200">
              {{ selectedCountry.code }}
            </span>
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4 pr-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="fixed left-0 top-0 h-[100vh] w-[100vw] bg-transparent"
          @click="showDropdown = false"
        />
        <div
          v-if="showDropdown"
          class="absolute top-10 z-[10000] mt-2 max-h-60 w-56 overflow-auto rounded-lg border border-[#D0D5DD] bg-white shadow-md dark:border-[#1F242F] dark:bg-[#1F242F] dark:text-white"
        >
          <div class="px-3" ref="searchInputRef">
            <input
              v-model="countrySearchText"
              type="text"
              class="my-2 h-8 w-full rounded-2xl border border-gray-300 bg-white text-sm outline-none focus:border-none focus:border-indigo-500 focus:ring-indigo-600 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
              placeholder="Search"
            />
          </div>
          <ul>
            <li
              v-for="country in filteredCountries"
              :key="country.code"
              :class="
                cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#444851]',
                  {
                    'bg-gray-200 dark:bg-[#444851]':
                      country.code === selectedCountry.code,
                  },
                )
              "
              @click="setSelectedCountry(country)"
            >
              <img
                :src="country.flag"
                alt="Flag"
                class="h-5 w-5 rounded-full object-cover"
              />
              <span class="text-sm text-[#344054] dark:text-zinc-200">
                {{ country.name }} ({{ country.code }})
              </span>
            </li>
          </ul>
        </div>

        <input
          type="number"
          v-model="phoneNumber"
          v-on:change="
            () => {
              isInputChanged = true;
              validate();
            }
          "
          :onblur="validate"
          :placeholder="props.placeholder"
          :class="
            cn(
              'w-full flex-1 rounded-lg border border-[#D0D5DD] bg-gray-100 px-3.5 py-2.5 pl-28 text-sm font-normal !outline-none !ring-0 focus:!border-[rgb(115,8,232)] focus:bg-white dark:border-[#61646C] dark:bg-[#333741] dark:text-white focus:dark:bg-gray-800',
              {
                'focus: border-red-600 !shadow-md focus:!border-red-600 focus:!shadow-red-300 dark:border-red-600 dark:focus:!shadow-red-900':
                  errorMessage,
              },
            )
          "
        />
      </div>
      <p
        v-if="errorMessage"
        class="mt-2 select-none text-sm text-red-600 dark:text-red-400"
      >
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
