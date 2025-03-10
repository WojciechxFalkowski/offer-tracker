<template>
  <div v-if="hasActiveFilters" class="active-filters">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-700">Aktywne filtry</h3>
      <button @click="clearAll" class="text-xs text-red-600 hover:text-red-800">
        Wyczyść wszystkie
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <div
        v-for="(filter, index) in activeFilters"
        :key="index"
        class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        <span class="mr-1 font-semibold">{{ filter.label }}:</span>
        <span>{{ filter.value }}</span>
        <button
          @click="removeFilter(filter.key)"
          class="ml-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          <IconX class="h-3 w-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IconX from "../icons/IconX.vue";

interface Filter {
  key: string;
  label: string;
  value: string;
}

const props = defineProps({
  filters: {
    type: Array as () => Filter[],
    required: true,
  },
});

const emit = defineEmits(["remove", "clear-all"]);

// Obliczane właściwości
const hasActiveFilters = computed(() => props.filters.length > 0);
const activeFilters = computed(() => props.filters);

// Funkcje
const removeFilter = (key: string) => {
  emit("remove", key);
};

const clearAll = () => {
  emit("clear-all");
};
</script>
