<template>
  <div class="number-filter">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{
      label
    }}</label>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option.value)"
        class="px-3 py-2 border rounded-md text-sm font-medium transition-colors"
        :class="
          isSelected(option.value)
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
        "
      >
        {{ option.label }}
      </button>

      <!-- Opcja "Dowolna" -->
      <button
        v-if="showAnyOption"
        @click="clearSelection"
        class="px-3 py-2 border rounded-md text-sm font-medium transition-colors"
        :class="
          !modelValue
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
        "
      >
        {{ anyOptionLabel }}
      </button>
    </div>

    <!-- Niestandardowa wartość (opcjonalnie) -->
    <div v-if="allowCustomValue" class="mt-3">
      <div class="flex items-center">
        <input
          type="number"
          v-model.number="customValue"
          :min="minValue"
          :max="maxValue"
          :placeholder="customValuePlaceholder"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @change="updateCustomValue"
        />

        <button
          v-if="customValue"
          @click="applyCustomValue"
          class="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Zastosuj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface NumberOption {
  value: number;
  label: string;
}

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array as () => NumberOption[],
    default: () => [],
  },
  showAnyOption: {
    type: Boolean,
    default: true,
  },
  anyOptionLabel: {
    type: String,
    default: "Dowolna",
  },
  allowCustomValue: {
    type: Boolean,
    default: false,
  },
  customValuePlaceholder: {
    type: String,
    default: "Inna wartość...",
  },
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: 100,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Lokalna wartość niestandardowa
const customValue = ref<number | null>(null);

// Obserwuj zmiany w props i aktualizuj lokalną wartość
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null) {
      customValue.value = null;
    } else if (!props.options.some((opt) => opt.value === newValue)) {
      customValue.value = newValue;
    }
  }
);

// Funkcje
const isSelected = (value: number) => {
  return props.modelValue === value;
};

const selectOption = (value: number) => {
  if (isSelected(value)) {
    // Jeśli ta sama wartość jest już wybrana, odznaczamy
    emit("update:modelValue", null);
    emit("change", null);
  } else {
    emit("update:modelValue", value);
    emit("change", value);
  }

  // Resetuj niestandardową wartość
  customValue.value = null;
};

const clearSelection = () => {
  emit("update:modelValue", null);
  emit("change", null);
  customValue.value = null;
};

const updateCustomValue = () => {
  // Walidacja zakresu
  if (customValue.value !== null) {
    if (customValue.value < props.minValue) {
      customValue.value = props.minValue;
    } else if (customValue.value > props.maxValue) {
      customValue.value = props.maxValue;
    }
  }
};

const applyCustomValue = () => {
  if (customValue.value !== null) {
    emit("update:modelValue", customValue.value);
    emit("change", customValue.value);
  }
};
</script>
