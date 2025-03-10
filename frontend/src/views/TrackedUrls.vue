<template>
  <ContainerWrapper>
    <!-- Formularz dodawania lub edycji URL-a -->
    <AddUrlForm @submit="saveUrl" :editData="editData" />

    <div class="bg-white rounded-lg shadow-md overflow-hidden mt-5">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Śledzone URL-e</h2>
        <p class="text-sm text-gray-500 mt-1">
          Lista wszystkich URL-i, które są aktualnie monitorowane
        </p>
      </div>

      <LoadingSpinner v-if="isLoading" />

      <TrackedUrlsTable
        v-else
        :trackedUrls="trackedUrls"
        @edit="setEditData"
        @delete="deleteUrl"
      />
    </div>
  </ContainerWrapper>
</template>

<script setup lang="ts">
import AddUrlForm from "@/components/AddUrlForm.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import TrackedUrlsTable from "@/components/TrackedUrlsTable.vue";
import { useTrackedUrls } from "@/composables/useTrackedUrls";
import ContainerWrapper from "@/components/ContainerWrapper.vue";

const { trackedUrls, isLoading, editData, saveUrl, deleteUrl, setEditData } =
  useTrackedUrls();
</script>
