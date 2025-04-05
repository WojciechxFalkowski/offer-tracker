<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Cena</label>

    <!-- Pola tekstowe do ustawiania wybranej ceny -->
    <InputText
      v-model="priceMinText"
      class="w-full mb-4"
      placeholder="Cena od"
    />

    <InputText
      v-model="priceMaxText"
      class="w-full mb-4"
      placeholder="Cena do"
    />

    <!-- Slider – zakres dostępnych cen (stały) oraz wybrany zakres (selectedRange) -->
    <Slider
      v-model="selectedRange"
      :min="min"
      :max="max"
      range
      class="w-full"
      @slideend="handleSlideEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";

// Props przekazywane z rodzica:
// - min i max – stały zakres slidera,
// - priceMin i priceMax – aktualnie wybrana wartość filtra (np. z query params)
const props = defineProps<{
  min: number;
  max: number;
  priceMin: number | null;
  priceMax: number | null;
}>();

// Emity dla aktualizacji wybranych wartości (v-model)
const emit = defineEmits<{
  (e: "update:priceMin", value: number): void;
  (e: "update:priceMax", value: number): void;
}>();

// Lokalne zmienne dla pól tekstowych – inicjalizowane na podstawie propsów
const priceMinText = ref<string>(String(props.priceMin ?? props.min));
const priceMaxText = ref<string>(String(props.priceMax ?? props.max));

// selectedRange – przechowuje aktualnie wybrany zakres ceny (używany przez Slider)
const selectedRange = ref<number[]>([props.priceMin, props.priceMax]);

// Jeśli użytkownik zmienia wartość w polach tekstowych, aktualizujemy selectedRange
watch(priceMinText, (newVal) => {
  const parsed = parseInt(newVal);
  if (!isNaN(parsed)) {
    selectedRange.value[0] = parsed;
  }
});
watch(priceMaxText, (newVal) => {
  const parsed = parseInt(newVal);
  if (!isNaN(parsed)) {
    selectedRange.value[1] = parsed;
  }
});

// Gdy slider zmieni selectedRange, aktualizujemy pola tekstowe oraz emitujemy zmiany
watch(selectedRange, (newRange) => {
  priceMinText.value = String(newRange[0]);
  priceMaxText.value = String(newRange[1]);
  emit("update:priceMin", newRange[0]);
  emit("update:priceMax", newRange[1]);
});

// Jeśli rodzic (np. z query params) zaktualizuje propsy, odświeżamy lokalne zmienne
watch(
  () => props.priceMin,
  (newVal) => {
    priceMinText.value = String(newVal);
    selectedRange.value[0] = newVal;
  }
);
watch(
  () => props.priceMax,
  (newVal) => {
    priceMaxText.value = String(newVal);
    selectedRange.value[1] = newVal;
  }
);

// Opcjonalnie – handler dla końca przesuwania slidera (możesz np. tu dodać debounce)
const handleSlideEnd = (event: any) => {
  // Możesz tu dodać logikę, która wykona się po zakończeniu przesuwania slidera
  // console.log("Slider zakończył przesuwanie", event);
};
</script>
