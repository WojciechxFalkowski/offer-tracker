<template>
  <div class="date-range-filter">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{
      label
    }}</label>

    <!-- Szybki wybór przedziałów dat -->
    <div class="flex flex-wrap gap-2 mb-3">
      <button
        v-for="preset in datePresets"
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

    <!-- Pola wyboru dat -->
    <div class="flex items-center space-x-4">
      <div class="w-1/2">
        <label class="block text-xs text-gray-500 mb-1">Od</label>
        <input
          type="date"
          v-model="startDateValue"
          :max="endDateValue || maxDate"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @change="updateStartDate"
        />
      </div>

      <div class="w-1/2">
        <label class="block text-xs text-gray-500 mb-1">Do</label>
        <input
          type="date"
          v-model="endDateValue"
          :min="startDateValue || minDate"
          :max="maxDate"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @change="updateEndDate"
        />
      </div>
    </div>

    <!-- Wyświetlanie aktualnego zakresu -->
    <div
      v-if="startDateValue || endDateValue"
      class="mt-2 text-sm text-gray-500"
    >
      {{ formatDateRange(startDateValue, endDateValue) }}
    </div>

    <!-- Przycisk czyszczenia zakresu -->
    <button
      v-if="startDateValue || endDateValue"
      @click="clearRange"
      class="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
    >
      <IconX class="w-3 h-3 mr-1" />
      Wyczyść zakres dat
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import IconX from "../icons/IconX.vue";

interface DatePreset {
  label: string;
  start: string | null;
  end: string | null;
}

const props = defineProps({
  startDate: {
    type: String,
    default: null,
  },
  endDate: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "Data dodania oferty",
  },
  minDate: {
    type: String,
    default: "2020-01-01",
  },
  maxDate: {
    type: String,
    default: () => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
  },
});

const emit = defineEmits(["update:startDate", "update:endDate", "change"]);

// Lokalne wartości
const startDateValue = ref(props.startDate);
const endDateValue = ref(props.endDate);

// Predefiniowane przedziały dat
const datePresets = computed(() => {
  const today = new Date();

  // Funkcja pomocnicza do formatowania daty
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Dzisiaj
  const todayStr = formatDate(today);

  // Ostatnie 24 godziny
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // Ostatni tydzień
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = formatDate(lastWeek);

  // Ostatni miesiąc
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = formatDate(lastMonth);

  // Ostatnie 3 miesiące
  const last3Months = new Date(today);
  last3Months.setMonth(last3Months.getMonth() - 3);
  const last3MonthsStr = formatDate(last3Months);

  return [
    { label: "Dzisiaj", start: todayStr, end: todayStr },
    { label: "Ostatnie 24h", start: yesterdayStr, end: todayStr },
    { label: "Ostatni tydzień", start: lastWeekStr, end: todayStr },
    { label: "Ostatni miesiąc", start: lastMonthStr, end: todayStr },
    { label: "Ostatnie 3 miesiące", start: last3MonthsStr, end: todayStr },
    { label: "Wszystkie", start: null, end: null },
  ] as DatePreset[];
});

// Obserwuj zmiany w props i aktualizuj lokalne wartości
watch(
  () => props.startDate,
  (newValue) => {
    startDateValue.value = newValue;
  }
);

watch(
  () => props.endDate,
  (newValue) => {
    endDateValue.value = newValue;
  }
);

// Funkcje
const updateStartDate = () => {
  emit("update:startDate", startDateValue.value);
  emit("change", {
    startDate: startDateValue.value,
    endDate: endDateValue.value,
  });
};

const updateEndDate = () => {
  emit("update:endDate", endDateValue.value);
  emit("change", {
    startDate: startDateValue.value,
    endDate: endDateValue.value,
  });
};

const clearRange = () => {
  startDateValue.value = null;
  endDateValue.value = null;

  emit("update:startDate", null);
  emit("update:endDate", null);
  emit("change", { startDate: null, endDate: null });
};

const applyPreset = (preset: DatePreset) => {
  startDateValue.value = preset.start;
  endDateValue.value = preset.end;

  emit("update:startDate", preset.start);
  emit("update:endDate", preset.end);
  emit("change", { startDate: preset.start, endDate: preset.end });
};

const isCurrentPreset = (preset: DatePreset) => {
  return (
    startDateValue.value === preset.start && endDateValue.value === preset.end
  );
};

const formatDateRange = (start: string | null, end: string | null) => {
  if (!start && !end) return "";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (start && end) {
    if (start === end) {
      return `Tylko ${formatDate(start)}`;
    }
    return `Od ${formatDate(start)} do ${formatDate(end)}`;
  } else if (start) {
    return `Od ${formatDate(start)}`;
  } else if (end) {
    return `Do ${formatDate(end)}`;
  }

  return "";
};
</script>
