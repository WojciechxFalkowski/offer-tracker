<template>
  <div
    v-if="message"
    class="mt-4 p-3 rounded-md"
    :class="
      message.type === 'success'
        ? 'bg-green-50 text-green-800'
        : 'bg-red-50 text-red-800'
    "
  >
    {{ message.text }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: Object,
    required: true,
  },
});
</script>
