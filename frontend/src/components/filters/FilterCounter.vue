<template>
  <div
    class="filter-counter inline-flex items-center justify-center"
    :class="{ 'animate-pulse': animate }"
  >
    <span
      v-if="count > 0"
      class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full transition-all duration-300"
      :class="{ 'scale-110': animate }"
    >
      {{ count }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
  animationDuration: {
    type: Number,
    default: 1000,
  },
});

// Stan animacji
const animate = ref(false);

// Obserwuj zmiany w count i uruchamiaj animację
watch(
  () => props.count,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      animate.value = true;

      setTimeout(() => {
        animate.value = false;
      }, props.animationDuration);
    }
  }
);
</script>

<style scoped>
.filter-counter {
  transition: all 0.3s ease;
}
</style>
