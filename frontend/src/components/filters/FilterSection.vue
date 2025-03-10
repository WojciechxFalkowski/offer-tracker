<template>
  <div class="filter-section mb-6">
    <!-- Nagłówek sekcji z możliwością zwijania/rozwijania -->
    <div
      @click="isCollapsed = !isCollapsed"
      class="flex items-center justify-between py-2 px-1 cursor-pointer group border-b border-gray-200 mb-3"
    >
      <div class="flex items-center">
        <component :is="icon" v-if="icon" class="w-5 h-5 mr-2 text-gray-500" />
        <h3 class="text-md font-medium text-gray-700">{{ title }}</h3>

        <!-- Badge z liczbą aktywnych filtrów w sekcji -->
        <span
          v-if="activeFiltersCount > 0"
          class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
        >
          {{ activeFiltersCount }}
        </span>
      </div>

      <!-- Ikona zwijania/rozwijania -->
      <div class="text-gray-400 group-hover:text-gray-600 transition-colors">
        <IconChevronDown v-if="!isCollapsed" class="w-5 h-5" />
        <IconChevronRight v-else class="w-5 h-5" />
      </div>
    </div>

    <!-- Zawartość sekcji (filtry) -->
    <div v-show="!isCollapsed" class="space-y-4 transition-all duration-300">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconChevronDown from "../icons/IconChevronDown.vue";
import IconChevronRight from "../icons/IconChevronRight.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    default: null,
  },
  activeFiltersCount: {
    type: Number,
    default: 0,
  },
  initiallyCollapsed: {
    type: Boolean,
    default: false,
  },
});

// Stan zwinięcia sekcji
const isCollapsed = ref(props.initiallyCollapsed);
</script>

<style scoped>
.filter-section:last-child {
  margin-bottom: 0;
}
</style>
