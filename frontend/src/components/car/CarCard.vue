<template>
  <div
    class="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <CarImageCarousel :images="car.images || []" :alt="car.title">
      <template #overlay> </template>
    </CarImageCarousel>

    <!-- Główne informacje -->
    <div class="flex flex-col h-full p-4 gap-4">
      <div class="flex justify-between items-start">
        <h2
          class="text-lg font-bold text-gray-800 mb-1 truncate overflow-hidden text-ellipsis"
          :title="car.title"
        >
          {{ car.title }}
        </h2>

        <span class="text-lg font-bold text-blue-600 text-nowrap"
          >{{ car.price }} zł</span
        >
      </div>

      <!-- Podstawowe dane -->
      <CarInfoSection>
        <CarInfoField label="Marka" :value="car.details.brand" />
        <CarInfoField label="Model" :value="car.details.model" />
        <CarInfoField label="Rok" :value="car.details.productionYear" />
        <CarInfoField label="Przebieg" :value="car.specification.mileage" />
        <CarInfoField
          label="Silnik"
          :value="car.specification.engineCapacity"
        />
        <CarInfoField label="Moc" :value="car.specification.power" />
        <CarInfoField label="Paliwo" :value="car.specification.fuelType" />
        <CarInfoField label="Skrzynia" :value="car.specification.gearbox" />
      </CarInfoSection>

      <!-- Dodatkowe informacje -->
      <CarInfoSection :hasBorder="true">
        <CarInfoField label="Kolor" :value="car.details.color" />
        <CarInfoField label="Napęd" :value="car.specification.drive" />
        <CarInfoField label="Nadwozie" :value="car.specification.bodyType" />
        <CarInfoField label="Drzwi" :value="car.details.doorCount" />
        <CarInfoField label="Miejsca" :value="car.details.seatCount" />
        <CarInfoField label="VIN" :value="car.details.vin" />
      </CarInfoSection>

      <!-- Przyciski akcji -->
      <div class="flex justify-between items-center mt-auto">
        <span class="text-xs text-gray-500">
          Dodano: {{ new Date(car.createdAt).toLocaleDateString() }}
        </span>
        <a
          :href="car.url"
          target="_blank"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Zobacz ofertę
        </a>
      </div>
    </div>

    <!-- <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 truncate">
        {{ car.title }}
      </h3>


      <div class="mt-2">
        <OfferSpecifications
          :mileage="mileage"
          :fuelType="fuelType"
          :transmission="transmission"
          :bodyType="props.car.value?.specification?.bodyType || null"
          :engineCapacity="
            props.car.value?.specification?.engineCapacity || null
          "
          :power="props.car.value?.specification?.power || null"
        />
      </div>

      <div class="mt-3">
        <OfferLocation
          :location="location"
          :formattedDate="formatDate(car.createdAt)"
        />
      </div>

      <div class="mt-4">
        <OfferActionButton :url="car.url" />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "@/utils/formatters";
import { Offer } from "@/types/offer.types";
import CarImageCarousel from "./CarImageCarousel.vue";
import CarInfoField from "@/components/car/CarInfoField.vue";
import CarInfoSection from "@/components/car/CarInfoSection.vue";

const props = defineProps({
  car: {
    type: Object as () => Offer,
    required: true,
  },
});

const productionYear = computed(() => {
  if (props.car?.details?.productionYear) {
    return props.car.details.productionYear;
  }
  return null;
});

const engineInfo = computed(() => {
  const power = props.car?.specification?.power;
  const capacity = props.car?.specification?.engineCapacity;

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
  return props.car?.details?.["Przebieg"] || null;
});

const fuelType = computed(() => {
  return props.car?.specification?.fuelType || null;
});

const transmission = computed(() => {
  return props.car?.specification?.gearbox || null;
});

const location = computed(() => {
  return props.car?.details?.["Lokalizacja"] || null;
});
</script>
