<template>
  <div
    class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <OfferImageCarousel :images="offer.images || []" :alt="offer.title">
      <template #overlay>
        <!-- Cena i rok produkcji -->
        <div
          class="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium"
        >
          {{ offer.price || "Cena nieznana" }}
        </div>
        <div
          v-if="productionYear"
          class="absolute top-0 left-0 bg-gray-800 text-white px-3 py-1 text-sm font-medium"
        >
          {{ productionYear }}
        </div>
      </template>
    </OfferImageCarousel>

    <div class="p-4">
      <!-- Tytuł oferty -->
      <h3 class="text-lg font-medium text-gray-900 truncate">
        {{ offer.title }}
      </h3>

      <!-- Kluczowe specyfikacje -->
      <div class="mt-2">
        <OfferSpecifications
          :mileage="mileage"
          :fuelType="fuelType"
          :transmission="transmission"
          :bodyType="props.offer.value?.specification?.bodyType || null"
          :engineCapacity="
            props.offer.value?.specification?.engineCapacity || null
          "
          :power="props.offer.value?.specification?.power || null"
        />
      </div>

      <!-- Lokalizacja i data dodania -->
      <div class="mt-3">
        <OfferLocation
          :location="location"
          :formattedDate="formatDate(offer.createdAt)"
        />
      </div>

      <!-- Przycisk akcji -->
      <div class="mt-4">
        <OfferActionButton :url="offer.url" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "@/utils/formatters";
import { Offer } from "@/types";
import OfferImageCarousel from "./OfferImageCarousel.vue";
import OfferSpecifications from "./OfferSpecifications.vue";
import OfferLocation from "./OfferLocation.vue";
import OfferActionButton from "./OfferActionButton.vue";

const props = defineProps({
  offer: {
    type: Object as () => Offer,
    required: true,
  },
});

const productionYear = computed(() => {
  if (props.offer?.details?.productionYear) {
    return props.offer.details.productionYear;
  }
  return null;
});

const engineInfo = computed(() => {
  const power = props.offer?.specification?.power;
  const capacity = props.offer?.specification?.engineCapacity;

  if (power && capacity) {
    return `${capacity}, ${power}`;
  } else if (power) {
    return power;
  } else if (capacity) {
    return capacity;
  }

  return null;
});

const mileage = computed(() => {
  return props.offer?.carDetails?.["Przebieg"] || null;
});

const fuelType = computed(() => {
  return props.offer?.specification?.fuelType || null;
});

const transmission = computed(() => {
  return props.offer?.specification?.gearbox || null;
});

const location = computed(() => {
  return props.offer?.carDetails?.["Lokalizacja"] || null;
});
</script>
