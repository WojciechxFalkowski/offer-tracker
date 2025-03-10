<template>
  <div class="source-filter">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{
      label
    }}</label>

    <div v-if="loading" class="flex items-center justify-center py-4">
      <div
        class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"
      ></div>
      <span class="ml-2 text-sm text-gray-500">Ładowanie źródeł...</span>
    </div>

    <div v-else-if="sources.length === 0" class="text-sm text-gray-500 mb-2">
      Brak dostępnych źródeł
    </div>

    <div v-else>
      <!-- Wyszukiwarka (opcjonalnie) -->
      <div v-if="showSearch" class="mb-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Szukaj źródeł..."
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <IconSearch class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Lista źródeł z checkboxami -->
      <div
        class="max-h-48 overflow-y-auto border border-gray-300 rounded-md divide-y divide-gray-200"
      >
        <label
          v-for="source in filteredSources"
          :key="source.id"
          class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            :value="source.id"
            v-model="selectedSourceIds"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="updateSelection"
          />
          <div class="ml-2 flex-1">
            <div class="text-sm text-gray-700 truncate">{{ source.name }}</div>
            <div v-if="source.url" class="text-xs text-gray-500 truncate">
              {{ source.url }}
            </div>
          </div>

          <!-- Badge z liczbą ofert -->
          <span
            v-if="source.count !== undefined"
            class="ml-auto px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {{ source.count }}
          </span>
        </label>
      </div>

      <!-- Przyciski szybkiego wyboru -->
      <div class="flex justify-between mt-2 text-xs">
        <button @click="selectAll" class="text-blue-600 hover:text-blue-800">
          Zaznacz wszystkie
        </button>
        <button
          @click="deselectAll"
          class="text-blue-600 hover:text-blue-800"
          :disabled="!hasSelected"
        >
          Odznacz wszystkie
        </button>
      </div>

      <!-- Wyświetlanie wybranych źródeł -->
      <div v-if="hasSelected" class="flex flex-wrap gap-2 mt-3">
        <div
          v-for="id in selectedSourceIds"
          :key="id"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ getSourceName(id) }}
          <button
            @click="removeSource(id)"
            class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <IconX class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import IconSearch from "../icons/IconSearch.vue";
import IconX from "../icons/IconX.vue";

interface Source {
  id: number;
  name: string;
  url?: string;
  count?: number;
}

const props = defineProps({
  modelValue: {
    type: Array as () => number[],
    default: () => [],
  },
  label: {
    type: String,
    default: "Źródło oferty",
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Stan komponentu
const loading = ref(false);
const sources = ref<Source[]>([]);
const selectedSourceIds = ref<number[]>([...props.modelValue]);
const searchQuery = ref("");

// Obliczane właściwości
const hasSelected = computed(() => selectedSourceIds.value.length > 0);

const filteredSources = computed(() => {
  if (!searchQuery.value) return sources.value;

  const query = searchQuery.value.toLowerCase();
  return sources.value.filter(
    (source) =>
      source.name.toLowerCase().includes(query) ||
      (source.url && source.url.toLowerCase().includes(query))
  );
});

// Obserwuj zmiany w props i aktualizuj lokalną kopię
watch(
  () => props.modelValue,
  (newValue) => {
    selectedSourceIds.value = [...newValue];
  },
  { deep: true }
);

// Funkcje
const fetchSources = async () => {
  loading.value = true;

  try {
    // Tutaj normalnie byłoby zapytanie do API
    // Symulacja opóźnienia i danych
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Przykładowe dane - w rzeczywistości pobierane z API
    sources.value = [
      {
        id: 1,
        name: "OTOMOTO - Audi",
        url: "https://www.otomoto.pl/osobowe/audi",
        count: 42,
      },
      {
        id: 2,
        name: "OTOMOTO - BMW",
        url: "https://www.otomoto.pl/osobowe/bmw",
        count: 37,
      },
      {
        id: 3,
        name: "OTOMOTO - Mercedes",
        url: "https://www.otomoto.pl/osobowe/mercedes-benz",
        count: 28,
      },
      {
        id: 4,
        name: "OTOMOTO - Volkswagen",
        url: "https://www.otomoto.pl/osobowe/volkswagen",
        count: 56,
      },
      {
        id: 5,
        name: "Autotrader - Audi",
        url: "https://www.autotrader.pl/osobowe/audi",
        count: 19,
      },
      {
        id: 6,
        name: "Autotrader - BMW",
        url: "https://www.autotrader.pl/osobowe/bmw",
        count: 23,
      },
      {
        id: 7,
        name: "Mobile.de - Premium",
        url: "https://www.mobile.de/premium",
        count: 15,
      },
    ];
  } catch (error) {
    console.error("Błąd podczas pobierania źródeł:", error);
    sources.value = [];
  } finally {
    loading.value = false;
  }
};

const updateSelection = () => {
  emit("update:modelValue", selectedSourceIds.value);
  emit("change", selectedSourceIds.value);
};

const selectAll = () => {
  selectedSourceIds.value = sources.value.map((source) => source.id);
  updateSelection();
};

const deselectAll = () => {
  selectedSourceIds.value = [];
  updateSelection();
};

const removeSource = (id: number) => {
  selectedSourceIds.value = selectedSourceIds.value.filter(
    (sourceId) => sourceId !== id
  );
  updateSelection();
};

const getSourceName = (id: number) => {
  const source = sources.value.find((s) => s.id === id);
  return source ? source.name : `Źródło #${id}`;
};

// Inicjalizacja
onMounted(fetchSources);
</script>
