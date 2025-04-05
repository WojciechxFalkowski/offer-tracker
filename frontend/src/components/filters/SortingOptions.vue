<template>
  <div class="sorting-options">
    <div class="flex items-center space-x-3">
      <label class="text-sm font-medium text-gray-700">Sortuj według:</label>

      <div class="relative flex-1">
        <select
          v-model="selectedOption"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          @change="updateSorting"
        >
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <button
        @click="toggleDirection"
        class="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        :title="isAscending ? 'Sortuj malejąco' : 'Sortuj rosnąco'"
      >
        <IconSortAscending v-if="isAscending" class="h-5 w-5 text-gray-500" />
        <IconSortDescending v-else class="h-5 w-5 text-gray-500" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import IconSortAscending from "../icons/IconSortAscending.vue";
import IconSortDescending from "../icons/IconSortDescending.vue";

interface SortOption {
  label: string;
  value: string;
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ field: "publishedDate", direction: "desc" }),
  },
  options: {
    type: Array as () => SortOption[],
    default: () => [
      { label: "Data dodania", value: "publishedDate" },
      { label: "Cena", value: "price" },
      { label: "Rok produkcji", value: "productionYear" },
      { label: "Przebieg", value: "mileage" },
      { label: "Moc silnika", value: "power" },
    ],
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Inicjalizacja lokalnych wartości na podstawie props
const selectedOption = ref(props.modelValue.field);
const isAscending = ref(props.modelValue.direction === "asc");

// Obserwuj zmiany w props i aktualizuj lokalne wartości
watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue.field;
    isAscending.value = newValue.direction === "asc";
  },
  { deep: true }
);

// Funkcja zmieniająca kierunek sortowania
const toggleDirection = () => {
  isAscending.value = !isAscending.value;
  updateSorting();
};

// Funkcja aktualizująca sortowanie i emitująca zmiany
const updateSorting = () => {
  const newSorting = {
    field: selectedOption.value,
    direction: isAscending.value ? "asc" : "desc",
  };

  emit("update:modelValue", newSorting);
  emit("change", newSorting);
};
</script>
