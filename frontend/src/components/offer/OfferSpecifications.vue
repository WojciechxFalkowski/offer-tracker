<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
    <!-- Przebieg -->
    <div
      v-if="mileage"
      class="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
      <span class="text-xs text-gray-500 font-medium">Przebieg</span>
      <span class="text-sm font-semibold mt-1">{{ mileage }}</span>
    </div>

    <!-- Rodzaj paliwa -->
    <div
      v-if="fuelType"
      class="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span class="text-xs text-gray-500 font-medium">Rodzaj paliwa</span>
      <span class="text-sm font-semibold mt-1">{{ fuelType }}</span>
    </div>

    <!-- Skrzynia biegów -->
    <div
      v-if="transmission"
      class="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
      <span class="text-xs text-gray-500 font-medium">Skrzynia biegów</span>
      <span class="text-sm font-semibold mt-1">{{ transmission }}</span>
    </div>

    <!-- Typ nadwozia -->
    <div
      v-if="bodyType"
      class="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span class="text-xs text-gray-500 font-medium">Typ nadwozia</span>
      <span class="text-sm font-semibold mt-1">{{ bodyType }}</span>
    </div>

    <!-- Pojemność skokowa -->
    <div
      v-if="engineCapacity"
      class="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <span class="text-xs text-gray-500 font-medium">Pojemność skokowa</span>
      <span class="text-sm font-semibold mt-1">{{ engineCapacity }}</span>
    </div>

    <!-- Moc -->
    <div
      v-if="power"
      class="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-600 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span class="text-xs text-gray-500 font-medium">Moc</span>
      <span class="text-sm font-semibold mt-1">{{ power }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  mileage: {
    type: String,
    default: null,
  },
  fuelType: {
    type: String,
    default: null,
  },
  transmission: {
    type: String,
    default: null,
  },
  bodyType: {
    type: String,
    default: null,
  },
  engineCapacity: {
    type: String,
    default: null,
  },
  power: {
    type: String,
    default: null,
  },
});
</script>
