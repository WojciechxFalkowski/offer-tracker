<template>
  <div class="select-filter">
    <label class="block text-sm font-medium text-gray-700 mb-1">{{
      label
    }}</label>

    <!-- Tryb pojedynczego wyboru -->
    <div v-if="!multiple" class="relative">
      <select
        v-model="selectedValue"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        :disabled="disabled"
        @change="updateValue"
      >
        <option v-if="showEmptyOption" value="">{{ emptyOptionLabel }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
      >
        <IconChevronDown class="h-4 w-4" />
      </div>
    </div>

    <!-- Tryb wielokrotnego wyboru -->
    <div v-else class="space-y-2">
      <!-- Przyciski szybkiego wyboru -->
      <div class="flex space-x-2 text-xs">
        <button
          @click="selectAll"
          class="text-blue-600 hover:text-blue-800"
          :disabled="disabled"
        >
          Zaznacz wszystkie
        </button>
        <span class="text-gray-500">|</span>
        <button
          @click="deselectAll"
          class="text-blue-600 hover:text-blue-800"
          :disabled="disabled || !hasSelected"
        >
          Odznacz wszystkie
        </button>
      </div>

      <!-- Lista opcji z checkboxami -->
      <div
        class="max-h-48 overflow-y-auto border border-gray-300 rounded-md divide-y divide-gray-200"
      >
        <label
          v-for="option in options"
          :key="option.value"
          class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        >
          <input
            type="checkbox"
            :value="option.value"
            v-model="selectedValues"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            :disabled="disabled"
            @change="updateValues"
          />
          <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>

          <!-- Badge z liczbą (opcjonalnie) -->
          <span
            v-if="option.count !== undefined"
            class="ml-auto px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {{ option.count }}
          </span>
        </label>
      </div>

      <!-- Wyświetlanie wybranych opcji -->
      <div v-if="hasSelected" class="flex flex-wrap gap-2 mt-2">
        <div
          v-for="value in selectedValues"
          :key="value"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ getOptionLabel(value) }}
          <button
            @click="removeValue(value)"
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
import { ref, computed, watch } from "vue";
import IconChevronDown from "../icons/IconChevronDown.vue";
import IconX from "../icons/IconX.vue";

interface SelectOption {
  label: string;
  value: string;
  count?: number;
}

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array as () => SelectOption[],
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showEmptyOption: {
    type: Boolean,
    default: true,
  },
  emptyOptionLabel: {
    type: String,
    default: "Wybierz opcję",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Lokalne wartości
const selectedValue = ref(props.multiple ? "" : (props.modelValue as string));
const selectedValues = ref<string[]>(
  props.multiple ? (props.modelValue as string[]) || [] : []
);

// Obliczane właściwości
const hasSelected = computed(() => selectedValues.value.length > 0);

// Obserwuj zmiany w props i aktualizuj lokalne wartości
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.multiple) {
      selectedValues.value = (newValue as string[]) || [];
    } else {
      selectedValue.value = newValue as string;
    }
  },
  { deep: true }
);

// Funkcje aktualizujące wartości
const updateValue = () => {
  emit("update:modelValue", selectedValue.value);
  emit("change", selectedValue.value);
};

const updateValues = () => {
  emit("update:modelValue", selectedValues.value);
  emit("change", selectedValues.value);
};

// Funkcje pomocnicze dla trybu wielokrotnego wyboru
const selectAll = () => {
  selectedValues.value = props.options.map((option) => option.value);
  updateValues();
};

const deselectAll = () => {
  selectedValues.value = [];
  updateValues();
};

const removeValue = (value: string) => {
  selectedValues.value = selectedValues.value.filter((v) => v !== value);
  updateValues();
};

// Funkcja pobierająca etykietę dla wartości
const getOptionLabel = (value: string) => {
  const option = props.options.find((opt) => opt.value === value);
  return option ? option.label : value;
};
</script>
