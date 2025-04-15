<script setup lang="ts">

import {
    onMounted,
    onUnmounted,
    ref,
} from "vue";


const props = defineProps<{
    disabled?: boolean;
}>();

const position = ref<{ x: number; y: number; width: number }>({
    x: 0,
    y: 0,
    width: 0,
});

const contextOpen = ref<boolean>(false);
const buttonRef = ref();
const dropdownRef = ref();
const contextMenu = ref();

/** context menu handler */
const onClickHandler = async (e: any) => { 
    if (
        (buttonRef.value.contains(e.target)) &&
        !props.disabled
    ) {
         const p = new Promise<void>((resolve) => {
                contextOpen.value = !contextOpen.value;
                resolve()
        })
        await p
        // update context position
        updatePosition();
    }
};

// update context position
const updatePosition = async () => {
   
    if (!dropdownRef.value || !contextMenu.value) return;

    const rect = dropdownRef.value.getBoundingClientRect();
    const menuRect = contextMenu.value.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Space availability
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceTop = rect.top;
    const spaceBottom = viewportHeight - rect.bottom;

    let x = rect.left + window.scrollX;
    let y = rect.bottom + window.scrollY; 

    // Adjust X (Left or Right)
    if (spaceRight < menuRect.width && spaceLeft >= menuRect.width) {
        x = rect.left + window.scrollX - (menuRect.width - rect.width);
    }

    // Adjust Y (Above or Below)
    if (spaceBottom < menuRect.height && spaceTop >= menuRect.height) {
        y = rect.top + window.scrollY - menuRect.height; 
    }

    position.value.x = x;
    position.value.y = y;
    position.value.width = rect.width;
};

onMounted(() => {
    // Listen for clicks
    if (typeof document !== "undefined") {
        document.addEventListener("click", (e: Event) => {
            if (
                dropdownRef.value &&
                !dropdownRef.value?.contains(e.target as Node) &&
                !contextMenu.value?.contains(e.target)
            ) {
                contextOpen.value = false;
            }
        });

        // Listen for scroll
        document.addEventListener("scroll", () => updatePosition(), true);
    }
});

onUnmounted(() => {
    document.removeEventListener("scroll",() => updatePosition(), true);
});


</script>
<template>
    <div ref="dropdownRef" class="inline-flex">
        <!-- Trigger button -->
        <div class="flex flex-row gap-3">
            <div class="relative flex flex-grow">
                <!-- for multiselect -->
                <button
                    type="button"
                    ref="buttonRef"
                    @click="onClickHandler"
                >
                    <slot name="context_trigger" :data="{disabled: disabled, open: contextMenu}"></slot>
                </button>

                <!-- Context menu -->
                <transition>
                    <Teleport to="body">
                        <div
                            ref="contextMenu"
                            v-if="contextOpen"
                            class="absolute z-[99] h-auto"
                            :style="`left: ${position.x}px; top: ${position.y}px;`"
                        >
                            <slot name="context_body" :data="{disabled: disabled, open: contextMenu, closeContext: () => {
                                contextOpen = false
                            }}" ></slot>
                        </div>
                    </Teleport>
                </transition>
            </div>
        </div>
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
