<div align="center">
  <img src="arts/logo.png" alt="alt text" height="250" width="250">
</div>

# @mediusware/shaper-ui

A simple opinionated UI library for Vue.js

## Installation

```bash
npm install @mediusware/shaper-ui
```

## Components

This library provides various UI components including:

- Alert
- Animation
- Badge
- Button
- Card
- CodeBlock
- DataTable
- DateTime
- Icons
- Loader
- Modal
- Popover
- Rating
- Search
- Skelaton
- Stepper
- Tab
- and more UI elements

## Usage

```vue
<template>
  <div>
    <Button>Click Me</Button>
    <Modal v-if="showModal" @close="showModal = false"> Modal Content </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Button, Modal } from "@mediusware/shaper-ui";

const showModal = ref(false);
</script>
```

## License

ISC
