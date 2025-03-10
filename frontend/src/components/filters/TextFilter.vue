<template>
  <div class="text-filter">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{
      label
    }}</label>

    <div class="relative">
      <!-- Input z autouzupełnianiem -->
      <div class="relative">
        <input
          :id="id"
          type="text"
          v-model="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          @focus="showDropdown = true"
          @input="onInput"
        />

        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <!-- Ikona wyszukiwania -->
          <IconSearch v-if="!inputValue" class="h-4 w-4 text-gray-400" />

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

      <!-- Dropdown z opcjami -->
      <div
        v-if="showDropdown && filteredOptions.length > 0"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
        >
          <span
            class="block truncate"
            :class="{ 'font-medium': option.value === modelValue }"
          >
            {{ option.label }}
          </span>

          <!-- Ikona zaznaczenia dla wybranej opcji -->
          <span
            v-if="option.value === modelValue"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
          >
            <IconCheck class="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>

    <!-- Komunikat o braku wyników -->
    <div v-if="noResults" class="mt-1 text-xs text-gray-500">
      Brak wyników dla "{{ inputValue }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import IconSearch from "../icons/IconSearch.vue";
import IconX from "../icons/IconX.vue";
import IconCheck from "../icons/IconCheck.vue";

interface Option {
  label: string;
  value: string;
}

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Wyszukaj...",
  },
  options: {
    type: Array as () => Option[],
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  allowCustomValues: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
import { useId } from "vue";
const id = useId();
// Generuj unikalny ID dla pola input

// Stan komponentu
const inputValue = ref("");
const showDropdown = ref(false);
const noResults = ref(false);

// Inicjalizacja wartości inputValue na podstawie modelValue
onMounted(() => {
  // Znajdź odpowiednią etykietę dla aktualnej wartości
  if (props.modelValue) {
    const selectedOption = props.options.find(
      (opt) => opt.value === props.modelValue
    );
    inputValue.value = selectedOption ? selectedOption.label : props.modelValue;
  }
});

// Filtrowanie opcji na podstawie wprowadzonego tekstu
const filteredOptions = computed(() => {
  if (!inputValue.value) return props.options;

  const filtered = props.options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.value.toLowerCase())
  );

  noResults.value = inputValue.value.length > 0 && filtered.length === 0;

  return filtered;
});

// Obserwuj zmiany w modelValue i aktualizuj inputValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      inputValue.value = "";
      return;
    }

    const selectedOption = props.options.find((opt) => opt.value === newValue);
    if (selectedOption) {
      inputValue.value = selectedOption.label;
    }
  }
);

// Obserwuj zmiany w options i aktualizuj inputValue jeśli potrzeba
watch(
  () => props.options,
  () => {
    if (props.modelValue) {
      const selectedOption = props.options.find(
        (opt) => opt.value === props.modelValue
      );
      if (selectedOption) {
        inputValue.value = selectedOption.label;
      }
    }
  },
  { deep: true }
);

// Funkcja obsługująca wprowadzanie tekstu
const onInput = () => {
  if (props.allowCustomValues) {
    emit("update:modelValue", inputValue.value);
  }
};

// Funkcja wybierająca opcję z dropdown
const selectOption = (option: Option) => {
  inputValue.value = option.label;
  emit("update:modelValue", option.value);
  showDropdown.value = false;
};

// Funkcja czyszcząca input
const clearInput = () => {
  inputValue.value = "";
  emit("update:modelValue", "");
};

// Zamykanie dropdown po kliknięciu poza komponentem
const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(`#${id}`)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
