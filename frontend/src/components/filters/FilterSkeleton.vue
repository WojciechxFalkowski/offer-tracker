<template>
  <div class="filter-skeleton">
    <!-- Nagłówek -->
    <div class="mb-2">
      <div class="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    </div>

    <!-- Zawartość -->
    <div class="space-y-3">
      <!-- Opcje filtra -->
      <div v-for="i in options" :key="i" class="flex items-center">
        <div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="ml-2 h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>

      <!-- Suwak (opcjonalnie) -->
      <div v-if="showSlider" class="mt-4">
        <div class="h-2 bg-gray-200 rounded-full w-full animate-pulse"></div>
        <div class="flex justify-between mt-4">
          <div class="h-8 bg-gray-200 rounded w-2/5 animate-pulse"></div>
          <div class="h-8 bg-gray-200 rounded w-2/5 animate-pulse"></div>
        </div>
      </div>

      <!-- Przyciski (opcjonalnie) -->
      <div v-if="showButtons" class="flex space-x-2 mt-4">
        <div
          v-for="i in buttons"
          :key="i"
          class="h-8 bg-gray-200 rounded w-1/4 animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  options: {
    type: Number,
    default: 5,
  },
  showSlider: {
    type: Boolean,
    default: false,
  },
  showButtons: {
    type: Boolean,
    default: false,
  },
  buttons: {
    type: Number,
    default: 3,
  },
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
