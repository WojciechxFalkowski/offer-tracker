<template>
  <AppHeader />

  <ContainerWrapper>
    <TabNavigation />
  </ContainerWrapper>

  <router-view></router-view>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";

import TabNavigation from "@/components/TabNavigation.vue";
import { onMounted } from "vue";
import { useCarStore } from "./stores/carStore";
import ContainerWrapper from "@/components/ContainerWrapper.vue";
import { useTrackedUrls } from "./composables/useTrackedUrls";
import { useFilterOptions } from "./composables/useFilterOptions";
const { fetchCars } = useCarStore();
const { fetchTrackedUrls } = useTrackedUrls();
const { fetchFilterOptions } = useFilterOptions();

onMounted(() => {
  fetchTrackedUrls();
  fetchCars();
  fetchFilterOptions();
});
</script>
