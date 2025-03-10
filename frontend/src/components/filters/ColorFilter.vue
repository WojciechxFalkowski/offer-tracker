<template>
  <div class="color-filter">
    <label class="block text-sm font-medium text-gray-700 mb-3">{{
      label
    }}</label>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="color in colors"
        :key="color.value"
        @click="toggleColor(color.value)"
        class="color-swatch relative w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
        :class="
          isSelected(color.value)
            ? 'border-blue-500 transform scale-110'
            : 'border-gray-300'
        "
        :style="{ backgroundColor: color.hex }"
        :title="color.label"
      >
        <!-- Checkmark dla wybranego koloru -->
        <div
          v-if="isSelected(color.value)"
          class="absolute inset-0 flex items-center justify-center"
        >
          <IconCheck
            class="w-4 h-4"
            :class="isLightColor(color.hex) ? 'text-gray-800' : 'text-white'"
          />
        </div>
      </button>

      <!-- Przycisk "Inne kolory" -->
      <button
        @click="toggleOtherColors"
        class="color-swatch relative w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 overflow-hidden"
        :class="
          isSelected('other')
            ? 'border-blue-500 transform scale-110'
            : 'border-gray-300'
        "
        title="Inne kolory"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-blue-500"
        ></div>
        <div
          v-if="isSelected('other')"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
        >
          <IconCheck class="w-4 h-4 text-white" />
        </div>
      </button>
    </div>

    <!-- Etykiety wybranych kolorów -->
    <div v-if="hasSelected" class="mt-3 flex flex-wrap gap-2">
      <div
        v-for="value in selectedColors"
        :key="value"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {{ getColorLabel(value) }}
        <button
          @click="toggleColor(value)"
          class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          <IconX class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Przycisk czyszczenia wyboru -->
    <button
      v-if="hasSelected"
      @click="clearSelection"
      class="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
    >
      <IconX class="w-3 h-3 mr-1" />
      Wyczyść kolory
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import IconCheck from "../icons/IconCheck.vue";
import IconX from "../icons/IconX.vue";

interface Color {
  value: string;
  label: string;
  hex: string;
}

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
  label: {
    type: String,
    default: "Kolor",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Predefiniowane kolory
const colors: Color[] = [
  { value: "black", label: "Czarny", hex: "#000000" },
  { value: "white", label: "Biały", hex: "#FFFFFF" },
  { value: "silver", label: "Srebrny", hex: "#C0C0C0" },
  { value: "gray", label: "Szary", hex: "#808080" },
  { value: "red", label: "Czerwony", hex: "#FF0000" },
  { value: "blue", label: "Niebieski", hex: "#0000FF" },
  { value: "green", label: "Zielony", hex: "#008000" },
  { value: "brown", label: "Brązowy", hex: "#A52A2A" },
  { value: "beige", label: "Beżowy", hex: "#F5F5DC" },
  { value: "gold", label: "Złoty", hex: "#FFD700" },
  { value: "orange", label: "Pomarańczowy", hex: "#FFA500" },
  { value: "yellow", label: "Żółty", hex: "#FFFF00" },
  { value: "purple", label: "Fioletowy", hex: "#800080" },
  { value: "other", label: "Inne kolory", hex: "gradient" },
];

// Lokalna kopia wybranych kolorów
const selectedColors = ref<string[]>([...props.modelValue]);

// Obserwuj zmiany w props i aktualizuj lokalną kopię
watch(
  () => props.modelValue,
  (newValue) => {
    selectedColors.value = [...newValue];
  },
  { deep: true }
);

// Obliczane właściwości
const hasSelected = computed(() => selectedColors.value.length > 0);

// Funkcje
const isSelected = (value: string) => {
  return selectedColors.value.includes(value);
};

const toggleColor = (value: string) => {
  if (isSelected(value)) {
    selectedColors.value = selectedColors.value.filter(
      (color) => color !== value
    );
  } else {
    selectedColors.value.push(value);
  }

  emit("update:modelValue", selectedColors.value);
  emit("change", selectedColors.value);
};

const toggleOtherColors = () => {
  toggleColor("other");
};

const clearSelection = () => {
  selectedColors.value = [];

  emit("update:modelValue", []);
  emit("change", []);
};

const getColorLabel = (value: string) => {
  const color = colors.find((c) => c.value === value);
  return color ? color.label : value;
};

// Funkcja sprawdzająca, czy kolor jest jasny (dla odpowiedniego koloru checkmark)
const isLightColor = (hex: string) => {
  // Dla gradientu zawsze używaj białego checkmark
  if (hex === "gradient") return false;

  // Konwersja hex na RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Obliczanie jasności (YIQ formula)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Jeśli YIQ > 128, kolor jest jasny
  return yiq > 128;
};
</script>

<style scoped>
.color-swatch {
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.color-swatch:hover {
  z-index: 1;
}
</style>
