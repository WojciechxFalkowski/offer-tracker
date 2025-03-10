<template>
  <a
    :href="url"
    target="_blank"
    class="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    {{ text }}
  </a>
</template>

<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "Zobacz szczegóły",
  },
});
</script>
