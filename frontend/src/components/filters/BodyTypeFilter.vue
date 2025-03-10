<template>
  <div class="body-type-filter">
    <label class="block text-sm font-medium text-gray-700 mb-3">{{
      label
    }}</label>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="type in bodyTypes"
        :key="type.value"
        @click="toggleBodyType(type.value)"
        class="flex flex-col items-center p-3 border rounded-lg transition-colors"
        :class="
          isSelected(type.value)
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
        "
      >
        <component
          :is="type.icon"
          class="w-10 h-10 mb-2"
          :class="isSelected(type.value) ? 'text-blue-500' : 'text-gray-500'"
        />
        <span class="text-xs font-medium text-center">{{ type.label }}</span>
      </button>
    </div>

    <!-- Przycisk czyszczenia wyboru -->
    <button
      v-if="hasSelected"
      @click="clearSelection"
      class="mt-3 text-sm text-red-600 hover:text-red-800 flex items-center"
    >
      <IconX class="w-3 h-3 mr-1" />
      Wyczyść wybór
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import IconX from "../icons/IconX.vue";
import IconSedan from "../icons/IconSedan.vue";
import IconHatchback from "../icons/IconHatchback.vue";
import IconCombi from "../icons/IconCombi.vue";
import IconSuv from "../icons/IconSuv.vue";
import IconCoupe from "../icons/IconCoupe.vue";
import IconCabriolet from "../icons/IconCabriolet.vue";
import IconMinivan from "../icons/IconMinivan.vue";
import IconPickup from "../icons/IconPickup.vue";

interface BodyType {
  value: string;
  label: string;
  icon: any;
}

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
  label: {
    type: String,
    default: "Typ nadwozia",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Predefiniowane typy nadwozia z ikonami
const bodyTypes: BodyType[] = [
  { value: "sedan", label: "Sedan", icon: IconSedan },
  { value: "hatchback", label: "Hatchback", icon: IconHatchback },
  { value: "combi", label: "Kombi", icon: IconCombi },
  { value: "suv", label: "SUV", icon: IconSuv },
  { value: "coupe", label: "Coupe", icon: IconCoupe },
  { value: "cabriolet", label: "Kabriolet", icon: IconCabriolet },
  { value: "minivan", label: "Minivan", icon: IconMinivan },
  { value: "pickup", label: "Pickup", icon: IconPickup },
];

// Lokalna kopia wybranych typów
const selectedTypes = ref<string[]>([...props.modelValue]);

// Obserwuj zmiany w props i aktualizuj lokalną kopię
watch(
  () => props.modelValue,
  (newValue) => {
    selectedTypes.value = [...newValue];
  },
  { deep: true }
);

// Obliczane właściwości
const hasSelected = computed(() => selectedTypes.value.length > 0);

// Funkcje
const isSelected = (value: string) => {
  return selectedTypes.value.includes(value);
};

const toggleBodyType = (value: string) => {
  if (isSelected(value)) {
    selectedTypes.value = selectedTypes.value.filter((type) => type !== value);
  } else {
    selectedTypes.value.push(value);
  }

  emit("update:modelValue", selectedTypes.value);
  emit("change", selectedTypes.value);
};

const clearSelection = () => {
  selectedTypes.value = [];

  emit("update:modelValue", []);
  emit("change", []);
};
</script>
