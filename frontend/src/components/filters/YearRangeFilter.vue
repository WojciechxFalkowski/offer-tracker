<template>
  <div class="year-range-filter">
    <div class="flex justify-between items-center mb-2">
      <label class="block text-sm font-medium text-gray-700">{{ label }}</label>

      <!-- Wyświetlanie aktualnego zakresu -->
      <div v-if="minValue || maxValue" class="text-sm text-gray-500">
        {{ minValue || minYear }} - {{ maxValue || currentYear }}
      </div>
    </div>

    <!-- Podwójny suwak -->
    <div class="relative h-2 bg-gray-200 rounded-full my-6">
      <!-- Pasek zakresu (kolorowy) -->
      <div
        class="absolute h-full bg-blue-500 rounded-full"
        :style="{
          left: `${
            (((minValue || minYear) - minYear) / (currentYear - minYear)) * 100
          }%`,
          right: `${
            100 -
            (((maxValue || currentYear) - minYear) / (currentYear - minYear)) *
              100
          }%`,
        }"
      ></div>

      <!-- Suwak minimum -->
      <input
        type="range"
        :min="minYear"
        :max="currentYear"
        :step="1"
        v-model.number="minValue"
        class="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        @input="updateMinValue"
      />

      <!-- Suwak maximum -->
      <input
        type="range"
        :min="minYear"
        :max="currentYear"
        :step="1"
        v-model.number="maxValue"
        class="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        @input="updateMaxValue"
      />

      <!-- Uchwyt minimum -->
      <div
        class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 transform -translate-x-1/2 cursor-grab focus:cursor-grabbing"
        :style="{
          left: `${
            (((minValue || minYear) - minYear) / (currentYear - minYear)) * 100
          }%`,
        }"
      ></div>

      <!-- Uchwyt maximum -->
      <div
        class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 transform -translate-x-1/2 cursor-grab focus:cursor-grabbing"
        :style="{
          left: `${
            (((maxValue || currentYear) - minYear) / (currentYear - minYear)) *
            100
          }%`,
        }"
      ></div>
    </div>

    <!-- Szybki wybór przedziałów lat -->
    <div class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="preset in yearPresets"
        :key="preset.label"
        @click="applyPreset(preset)"
        class="px-2 py-1 text-xs border rounded transition-colors"
        :class="
          isCurrentPreset(preset)
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
        "
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Pola do ręcznego wprowadzania lat -->
    <div class="flex items-center space-x-4">
      <div class="w-1/2">
        <label class="block text-xs text-gray-500 mb-1">Od roku</label>
        <select
          v-model.number="minValue"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @change="updateMinValue"
        >
          <option :value="null">Dowolny</option>
          <option
            v-for="year in yearOptions"
            :key="`min-${year}`"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
      </div>

      <div class="w-1/2">
        <label class="block text-xs text-gray-500 mb-1">Do roku</label>
        <select
          v-model.number="maxValue"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @change="updateMaxValue"
        >
          <option :value="null">Dowolny</option>
          <option
            v-for="year in yearOptions"
            :key="`max-${year}`"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <!-- Przycisk czyszczenia zakresu -->
    <button
      v-if="minValue || maxValue"
      @click="clearRange"
      class="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
    >
      <IconX class="w-3 h-3 mr-1" />
      Wyczyść zakres lat
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import IconX from "../icons/IconX.vue";

interface YearPreset {
  label: string;
  min: number | null;
  max: number | null;
}

const props = defineProps({
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    default: "Rok produkcji",
  },
  minYear: {
    type: Number,
    default: 1990,
  },
});

const emit = defineEmits(["update:min", "update:max", "change"]);

// Lokalne wartości
const minValue = ref(props.min);
const maxValue = ref(props.max);

// Obliczane właściwości
const currentYear = new Date().getFullYear();

// Generowanie opcji lat
const yearOptions = computed(() => {
  const years = [];
  for (let year = currentYear; year >= props.minYear; year--) {
    years.push(year);
  }
  return years;
});

// Predefiniowane przedziały lat
const yearPresets = computed(() => {
  return [
    { label: "Nowe (0-2 lata)", min: currentYear - 2, max: currentYear },
    {
      label: "Prawie nowe (3-5 lat)",
      min: currentYear - 5,
      max: currentYear - 3,
    },
    {
      label: "Używane (6-10 lat)",
      min: currentYear - 10,
      max: currentYear - 6,
    },
    {
      label: "Starsze (powyżej 10 lat)",
      min: props.minYear,
      max: currentYear - 10,
    },
  ] as YearPreset[];
});

// Obserwuj zmiany w props i aktualizuj lokalne wartości
watch(
  () => props.min,
  (newValue) => {
    minValue.value = newValue;
  }
);

watch(
  () => props.max,
  (newValue) => {
    maxValue.value = newValue;
  }
);

// Funkcje aktualizujące wartości
const updateMinValue = () => {
  // Upewnij się, że min nie jest większe niż max
  if (
    maxValue.value !== null &&
    minValue.value !== null &&
    minValue.value > maxValue.value
  ) {
    minValue.value = maxValue.value;
  }

  emit("update:min", minValue.value);
  emit("change", { min: minValue.value, max: maxValue.value });
};

const updateMaxValue = () => {
  // Upewnij się, że max nie jest mniejsze niż min
  if (
    minValue.value !== null &&
    maxValue.value !== null &&
    maxValue.value < minValue.value
  ) {
    maxValue.value = minValue.value;
  }

  emit("update:max", maxValue.value);
  emit("change", { min: minValue.value, max: maxValue.value });
};

// Funkcja czyszcząca zakres
const clearRange = () => {
  minValue.value = null;
  maxValue.value = null;

  emit("update:min", null);
  emit("update:max", null);
  emit("change", { min: null, max: null });
};

// Funkcja aplikująca preset
const applyPreset = (preset: YearPreset) => {
  minValue.value = preset.min;
  maxValue.value = preset.max;

  emit("update:min", preset.min);
  emit("update:max", preset.max);
  emit("change", { min: preset.min, max: preset.max });
};

// Funkcja sprawdzająca, czy dany preset jest aktualnie wybrany
const isCurrentPreset = (preset: YearPreset) => {
  return minValue.value === preset.min && maxValue.value === preset.max;
};
</script>

<style scoped>
/* Stylizacja suwaków (opcjonalnie) */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #3b82f6;
  cursor: pointer;
}
</style>
