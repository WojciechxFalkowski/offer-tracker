<template>
  <div>
    <!-- Przycisk otwierający drawer -->
    <button
      @click="isOpen = true"
      class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
    >
      <IconFilter class="w-5 h-5 mr-2" />
      Filtry
      <span
        v-if="activeFiltersCount > 0"
        class="ml-2 px-2 py-0.5 bg-white text-blue-600 text-xs font-bold rounded-full"
      >
        {{ activeFiltersCount }}
      </span>
    </button>

    <!-- Backdrop (tło przyciemniające) -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      @click="isOpen = false"
    ></div>

    <!-- Drawer (panel boczny) -->
    <div
      class="fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 overflow-hidden flex flex-col"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Nagłówek drawera -->
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-800">Filtry samochodów</h2>
        <button
          @click="isOpen = false"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <IconX class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Zawartość drawera (filtry) -->
      <div class="flex-1 overflow-y-auto p-4">
        <slot></slot>
      </div>

      <!-- Stopka drawera z przyciskami akcji -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-gray-500">
            Aktywne filtry: <strong>{{ activeFiltersCount }}</strong>
          </span>
          <button
            v-if="activeFiltersCount > 0"
            @click="clearFilters"
            class="text-sm text-red-600 hover:text-red-800"
          >
            Wyczyść wszystkie
          </button>
        </div>
        <div class="flex space-x-3">
          <button
            @click="isOpen = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Anuluj
          </button>
          <button
            @click="applyFilters"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zastosuj filtry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from "vue";
import IconFilter from "../icons/IconFilter.vue";
import IconX from "../icons/IconX.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  activeFiltersCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue", "apply", "clear"]);

const isOpen = ref(false);

// Lokalna kopia filtrów, aby można było anulować zmiany
const localFilters = ref({ ...props.modelValue });

// Obserwuj zmiany w props.modelValue i aktualizuj lokalną kopię
watch(
  () => props.modelValue,
  (newValue) => {
    if (!isOpen.value) {
      // Aktualizuj tylko gdy drawer jest zamknięty, aby nie nadpisać zmian użytkownika
      localFilters.value = { ...newValue };
    }
  },
  { deep: true }
);

// Obserwuj zmiany w isOpen i resetuj lokalną kopię, gdy drawer jest otwierany
watch(isOpen, (newValue) => {
  if (newValue) {
    // Gdy drawer jest otwierany, zresetuj lokalną kopię
    localFilters.value = { ...props.modelValue };
  }
});

// Funkcja do zastosowania filtrów
const applyFilters = () => {
  // emit("update:modelValue", localFilters.value);
  emit("apply", localFilters.value);
  isOpen.value = false;
};

// Funkcja do czyszczenia filtrów
const clearFilters = () => {
  localFilters.value = {};
  emit("update:modelValue", {});
  emit("clear");
};

// Udostępnij lokalną kopię filtrów dla komponentów potomnych
provide("filters", localFilters);
</script>

<style scoped>
/* Dodatkowe style dla drawera */
@media (max-width: 640px) {
  .fixed.right-0.w-full {
    height: 90vh;
    bottom: 0;
    top: auto;
    border-radius: 1rem 1rem 0 0;
  }
}
</style>
