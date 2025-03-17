<template>
  <div class="pagination flex items-center justify-center space-x-2">
    <!-- Przycisk "Poprzednia" -->
    <button
      @click="onPageChange(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 rounded border"
      :class="
        currentPage === 1
          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
          : 'border-blue-500 text-blue-500 hover:bg-blue-50'
      "
    >
      &laquo; Poprzednia
    </button>

    <!-- Numery stron -->
    <div class="flex space-x-1">
      <template v-for="page in visiblePages" :key="page">
        <!-- Separator (wielokropek) -->
        <span v-if="page === '...'" class="px-3 py-1 text-gray-500">...</span>

        <!-- Przycisk strony -->
        <button
          v-else
          @click="onPageChange(page)"
          class="px-3 py-1 rounded"
          :class="
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'border border-gray-200 hover:bg-gray-50'
          "
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Przycisk "Następna" -->
    <button
      @click="onPageChange(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 rounded border"
      :class="
        currentPage === totalPages
          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
          : 'border-blue-500 text-blue-500 hover:bg-blue-50'
      "
    >
      Następna &raquo;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["page-change"]);

// Oblicz widoczne strony z uwzględnieniem separatorów (...)
const visiblePages = computed(() => {
  if (props.totalPages <= props.maxVisiblePages) {
    // Jeśli całkowita liczba stron jest mniejsza lub równa maksymalnej liczbie widocznych stron,
    // pokaż wszystkie strony
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const leftSide = Math.floor(props.maxVisiblePages / 2);
  const rightSide = props.maxVisiblePages - leftSide - 1;

  // Zawsze pokazuj pierwszą stronę
  pages.push(1);

  if (props.currentPage - leftSide > 2) {
    // Dodaj separator, jeśli bieżąca strona jest daleko od początku
    pages.push("...");
  }

  // Oblicz zakres stron wokół bieżącej strony
  const start = Math.max(2, props.currentPage - leftSide);
  const end = Math.min(props.totalPages - 1, props.currentPage + rightSide);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (props.currentPage + rightSide < props.totalPages - 1) {
    // Dodaj separator, jeśli bieżąca strona jest daleko od końca
    pages.push("...");
  }

  // Zawsze pokazuj ostatnią stronę, jeśli jest więcej niż jedna strona
  if (props.totalPages > 1) {
    pages.push(props.totalPages);
  }

  return pages;
});

// Obsługa zmiany strony
const onPageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-change", page);
  }
};
</script>
