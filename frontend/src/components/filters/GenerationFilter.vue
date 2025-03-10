<template>
  <div class="generation-filter">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{
      label
    }}</label>

    <div
      v-if="!selectedBrand || !selectedModel"
      class="text-sm text-gray-500 mb-2"
    >
      Najpierw wybierz markę i model samochodu
    </div>

    <div v-else-if="loading" class="flex items-center justify-center py-4">
      <div
        class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"
      ></div>
      <span class="ml-2 text-sm text-gray-500">Ładowanie generacji...</span>
    </div>

    <div
      v-else-if="generations.length === 0"
      class="text-sm text-gray-500 mb-2"
    >
      Brak dostępnych generacji dla wybranego modelu
    </div>

    <div v-else class="space-y-3">
      <!-- Przyciski generacji -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="gen in generations"
          :key="gen.value"
          @click="selectGeneration(gen.value)"
          class="px-3 py-2 border rounded-md text-sm font-medium transition-colors"
          :class="
            isSelected(gen.value)
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
          "
        >
          {{ gen.label }}
        </button>

        <!-- Opcja "Dowolna" -->
        <button
          @click="clearSelection"
          class="px-3 py-2 border rounded-md text-sm font-medium transition-colors"
          :class="
            !modelValue
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
          "
        >
          Dowolna
        </button>
      </div>

      <!-- Informacje o wybranej generacji -->
      <div
        v-if="selectedGeneration && selectedGeneration.description"
        class="p-3 bg-gray-50 rounded-md text-sm text-gray-700"
      >
        <h4 class="font-medium mb-1">{{ selectedGeneration.label }}</h4>
        <p>{{ selectedGeneration.description }}</p>
        <p v-if="selectedGeneration.years" class="mt-1 text-xs text-gray-500">
          Lata produkcji: {{ selectedGeneration.years }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

interface Generation {
  value: string;
  label: string;
  description?: string;
  years?: string;
}

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Generacja",
  },
  selectedBrand: {
    type: String,
    default: "",
  },
  selectedModel: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Stan komponentu
const loading = ref(false);
const generations = ref<Generation[]>([]);

// Obliczane właściwości
const selectedGeneration = computed(() => {
  if (!props.modelValue) return null;
  return (
    generations.value.find((gen) => gen.value === props.modelValue) || null
  );
});

// Obserwuj zmiany w marce i modelu
watch(
  [() => props.selectedBrand, () => props.selectedModel],
  async ([newBrand, newModel]) => {
    if (newBrand && newModel) {
      await fetchGenerations(newBrand, newModel);
    } else {
      generations.value = [];
    }

    // Resetuj wybraną generację, jeśli zmieniono markę lub model
    emit("update:modelValue", "");
    emit("change", "");
  },
  { immediate: true }
);

// Funkcje
const fetchGenerations = async (brand: string, model: string) => {
  loading.value = true;

  try {
    // Tutaj normalnie byłoby zapytanie do API
    // Symulacja opóźnienia i danych
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Przykładowe dane - w rzeczywistości pobierane z API
    if (brand === "audi" && model === "a4") {
      generations.value = [
        {
          value: "b5",
          label: "B5 (1994-2001)",
          description: "Pierwsza generacja Audi A4, zastąpiła model Audi 80.",
          years: "1994-2001",
        },
        {
          value: "b6",
          label: "B6 (2001-2005)",
          description:
            "Druga generacja z nowym designem i ulepszoną technologią.",
          years: "2001-2005",
        },
        {
          value: "b7",
          label: "B7 (2005-2008)",
          description:
            "Odświeżona wersja B6 z nowymi silnikami i wyposażeniem.",
          years: "2005-2008",
        },
        {
          value: "b8",
          label: "B8 (2008-2015)",
          description: "Czwarta generacja z nową platformą MLB.",
          years: "2008-2015",
        },
        {
          value: "b9",
          label: "B9 (2015-2023)",
          description:
            "Piąta generacja z zaawansowanymi systemami wspomagania kierowcy.",
          years: "2015-2023",
        },
        {
          value: "b10",
          label: "B10 (od 2023)",
          description: "Najnowsza generacja z hybrydowymi układami napędowymi.",
          years: "od 2023",
        },
      ];
    } else if (brand === "bmw" && model === "3") {
      generations.value = [
        { value: "e30", label: "E30 (1982-1994)" },
        { value: "e36", label: "E36 (1990-2000)" },
        { value: "e46", label: "E46 (1998-2007)" },
        { value: "e90", label: "E90/E91/E92/E93 (2005-2013)" },
        { value: "f30", label: "F30/F31/F34 (2011-2019)" },
        { value: "g20", label: "G20/G21 (od 2019)" },
      ];
    } else {
      generations.value = [];
    }
  } catch (error) {
    console.error("Błąd podczas pobierania generacji:", error);
    generations.value = [];
  } finally {
    loading.value = false;
  }
};

const isSelected = (value: string) => {
  return props.modelValue === value;
};

const selectGeneration = (value: string) => {
  emit("update:modelValue", value);
  emit("change", value);
};

const clearSelection = () => {
  emit("update:modelValue", "");
  emit("change", "");
};

// Inicjalizacja
onMounted(async () => {
  if (props.selectedBrand && props.selectedModel) {
    await fetchGenerations(props.selectedBrand, props.selectedModel);
  }
});
</script>
