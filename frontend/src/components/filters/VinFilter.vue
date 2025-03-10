<template>
  <div class="vin-filter">
    <label
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-2"
      >{{ label }}</label
    >

    <div class="relative">
      <input
        :id="inputId"
        type="text"
        v-model="vinValue"
        :placeholder="placeholder"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase"
        :class="{
          'border-red-300 focus:ring-red-500 focus:border-red-500': error,
        }"
        @input="validateAndUpdate"
        @blur="validateOnBlur"
      />

      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <!-- Ikona wyszukiwania -->
        <IconSearch v-if="!vinValue" class="h-4 w-4 text-gray-400" />

        <!-- Ikona błędu -->
        <IconExclamation v-else-if="error" class="h-4 w-4 text-red-500" />

        <!-- Ikona sukcesu -->
        <IconCheck v-else-if="isValid" class="h-4 w-4 text-green-500" />

        <!-- Przycisk czyszczenia -->
        <button
          v-else
          type="button"
          @click="clearInput"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <IconX class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Komunikat błędu -->
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>

    <!-- Informacja o formacie -->
    <p class="mt-1 text-xs text-gray-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import IconSearch from "../icons/IconSearch.vue";
import IconX from "../icons/IconX.vue";
import IconCheck from "../icons/IconCheck.vue";
import IconExclamation from "../icons/IconExclamation.vue";

// Generowanie unikalnego ID dla pola input
const inputId = `vin-filter-${Math.random().toString(36).substring(2, 9)}`;

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Numer VIN",
  },
  placeholder: {
    type: String,
    default: "np. WVWZZZ1JZXW000001",
  },
  helpText: {
    type: String,
    default: "Numer VIN składa się z 17 znaków (litery i cyfry).",
  },
  validateOnInput: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Stan komponentu
const vinValue = ref(props.modelValue);
const error = ref("");
const isValid = ref(false);

// Obserwuj zmiany w props i aktualizuj lokalną wartość
watch(
  () => props.modelValue,
  (newValue) => {
    vinValue.value = newValue;
    if (newValue) {
      validateVin(newValue, false);
    } else {
      error.value = "";
      isValid.value = false;
    }
  }
);

// Funkcje
const validateVin = (vin: string, emitEvent: boolean = true) => {
  // Resetuj stan
  error.value = "";
  isValid.value = false;

  // Walidacja podstawowa
  if (!vin) {
    return;
  }

  // Usuń spacje i zamień na wielkie litery
  const cleanVin = vin.replace(/\s/g, "").toUpperCase();

  // Sprawdź długość
  if (cleanVin.length !== 17) {
    error.value = "Numer VIN musi składać się dokładnie z 17 znaków.";
    return;
  }

  // Sprawdź dozwolone znaki (litery i cyfry, bez I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(cleanVin)) {
    error.value = "Numer VIN może zawierać tylko litery (bez I, O, Q) i cyfry.";
    return;
  }

  // Można dodać bardziej zaawansowaną walidację, np. sprawdzenie cyfry kontrolnej
  // ...

  // Jeśli wszystko OK
  isValid.value = true;

  // Aktualizuj model jeśli potrzeba
  if (emitEvent && cleanVin !== props.modelValue) {
    emit("update:modelValue", cleanVin);
    emit("change", cleanVin);
  }
};

const validateAndUpdate = () => {
  // Aktualizuj model bez walidacji
  emit("update:modelValue", vinValue.value);

  // Waliduj tylko jeśli wymagane
  if (props.validateOnInput) {
    validateVin(vinValue.value, false);
  } else {
    // Resetuj błąd podczas pisania
    error.value = "";
  }
};

const validateOnBlur = () => {
  validateVin(vinValue.value);
};

const clearInput = () => {
  vinValue.value = "";
  error.value = "";
  isValid.value = false;

  emit("update:modelValue", "");
  emit("change", "");
};
</script>
