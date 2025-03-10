<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Nagłówek -->
    <AppHeader />

    <!-- Główna zawartość -->
    <main class="container mx-auto px-4 py-8">
      <!-- Tabs -->
      <TabNavigation :activeTab="activeTab" @change-tab="activeTab = $event" />

      <!-- Zawartość tabów -->
      <TrackedUrls v-if="activeTab === 'URLs'" />

      <OffersList
        v-else-if="activeTab === 'offers'"
        :offers="offers"
        :isLoading="isLoadingOffers"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppHeader from "./components/AppHeader.vue";
import TabNavigation from "./components/TabNavigation.vue";
import TrackedUrls from "./components/TrackedUrls.vue";
import OffersList from "./components/OffersList.vue";
import api from "./services/api";

const activeTab = ref("URLs");
const isLoadingOffers = ref(false);
const offers = ref([]);

// Pobieranie ofert
async function fetchOffers() {
  isLoadingOffers.value = true;
  try {
    // await api.get("/api/cars?limit=30&sort=createdAt,DESC");
    const response = await api.get("/api/cars?limit=500&sort=createdAt,DESC");
    offers.value = response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania ofert:", error);
  } finally {
    isLoadingOffers.value = false;
  }
}

onMounted(() => {
  fetchOffers();
});
</script>
