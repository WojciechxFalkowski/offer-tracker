<template>
  <div class="mx-auto">
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Najnowsze oferty</h2>
        <p class="text-sm text-gray-500 mt-1">
          Lista ostatnio znalezionych ofert samochodowych
        </p>
      </div>

      <LoadingSpinner v-if="isLoading" />

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
      >
        <OfferCard v-for="offer in offers" :key="offer.id" :offer="offer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import OfferCard from "./offer/OfferCard.vue";

defineProps({
  offers: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
