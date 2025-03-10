<template>
  <div class="range-filter">
    <div class="flex justify-between items-center mb-2">
      <label class="block text-sm font-medium text-gray-700">{{ label }}</label>

      <!-- Wyświetlanie aktualnego zakresu -->
      <div v-if="minValue || maxValue" class="text-sm text-gray-500">
        {{ formatValue(minValue || minLimit) }}{{ unit }} -
        {{ formatValue(maxValue || maxLimit) }}{{ unit }}
      </div>
    </div>

    <!-- Podwójny suwak -->
    <div class="relative h-2 bg-gray-200 rounded-full my-6">
      <!-- Pasek zakresu (kolorowy) -->
      <div
        class="absolute h-full bg-blue-500 rounded-full"
        :style="{
          left: `${
            (((minValue || minLimit) - minLimit) / (maxLimit - minLimit)) * 100
          }%`,
          right: `${
            100 -
            (((maxValue || maxLimit) - minLimit) / (maxLimit - minLimit)) * 100
          }%`,
        }"
      ></div>

      <!-- Suwak minimum -->
      <input
        type="range"
        :min="minLimit"
        :max="maxLimit"
        :step="step"
        v-model.number="minValue"
        class="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        @input="updateMinValue"
      />

      <!-- Suwak maximum -->
      <input
        type="range"
        :min="minLimit"
        :max="maxLimit"
        :step="step"
        v-model.number="maxValue"
        class="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        @input="updateMaxValue"
      />

      <!-- Uchwyt minimum -->
      <div
        class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 transform -translate-x-1/2 cursor-grab focus:cursor-grabbing"
        :style="{
          left: `${
            (((minValue || minLimit) - minLimit) / (maxLimit - minLimit)) * 100
          }%`,
        }"
      ></div>

      <!-- Uchwyt maximum -->
      <div
        class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 transform -translate-x-1/2 cursor-grab focus:cursor-grabbing"
        :style="{
          left: `${
            (((maxValue || maxLimit) - minLimit) / (maxLimit - minLimit)) * 100
          }%`,
        }"
      ></div>
    </div>

    <!-- Pola do ręcznego wprowadzania wartości -->
    <div class="flex items-center space-x-4">
      <div class="w-1/2">
        <label class="block text-xs text-gray-500 mb-1">Od</label>
        <div class="relative">
          <input
            type="number"
            v-model.number="minValue"
            :min="minLimit"
            :max="maxValue || maxLimit"
            :step="step"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            @change="updateMinValue"
          />
          <div
            v-if="unit"
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <span class="text-gray-500 sm:text-sm">{{ unit }}</span>
          </div>
        </div>
      </div>

      <div class="w-1/2">
        <label class="block text-xs text-gray-500 mb-1">Do</label>
        <div class="relative">
          <input
            type="number"
            v-model.number="maxValue"
            :min="minValue || minLimit"
            :max="maxLimit"
            :step="step"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            @change="updateMaxValue"
          />
          <div
            v-if="unit"
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <span class="text-gray-500 sm:text-sm">{{ unit }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Przycisk czyszczenia zakresu -->
    <button
      v-if="minValue || maxValue"
      @click="clearRange"
      class="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
    >
      <IconX class="w-3 h-3 mr-1" />
      Wyczyść zakres
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import IconX from "../icons/IconX.vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    default: null,
  },
  max: {
    type: Number,
    default: null,
  },
  minLimit: {
    type: Number,
    default: 0,
  },
  maxLimit: {
    type: Number,
    default: 1000,
  },
  step: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    default: "",
  },
  formatFn: {
    type: Function as PropType<(value: number) => string>,
    default: null,
  },
});

const emit = defineEmits(["update:min", "update:max", "change"]);

// Lokalne wartości
const minValue = ref(props.min);
const maxValue = ref(props.max);

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
  if (maxValue.value !== null && minValue.value > maxValue.value) {
    minValue.value = maxValue.value;
  }

  emit("update:min", minValue.value);
  emit("change", { min: minValue.value, max: maxValue.value });
};

const updateMaxValue = () => {
  // Upewnij się, że max nie jest mniejsze niż min
  if (minValue.value !== null && maxValue.value < minValue.value) {
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

// Funkcja formatująca wartość
const formatValue = (value: number) => {
  if (props.formatFn) {
    return props.formatFn(value);
  }

  return value.toString();
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
