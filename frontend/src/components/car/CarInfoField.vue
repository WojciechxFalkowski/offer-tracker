<template>
  <div class="flex items-center overflow-hidden">
    <span class="font-medium mr-1 flex-shrink-0">{{ label }}:</span>
    <span
      class="truncate overflow-hidden text-ellipsis w-full"
      :class="textClass"
      :title="value"
    >
      {{ value }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: "-",
  },
  textClass: {
    type: String,
    default: "",
  },
});
</script>
