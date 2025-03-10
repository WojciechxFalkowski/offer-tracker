<template>
  <div :class="{ 'pt-3 border-t border-gray-200': hasBorder }">
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  hasBorder: {
    type: Boolean,
    default: false,
  },
});
</script>
