<template>
  <div class="max-w-4xl mx-auto">
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

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">URL</th>
              <th class="px-6 py-3">Opis</th>
              <th class="px-6 py-3">Data dodania</th>
              <th class="px-6 py-3">Oferty</th>
              <th class="px-6 py-3">Akcje</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="url in trackedUrls"
              :key="url.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ url.id }}</td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs"
              >
                <a
                  :href="url.url"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 hover:underline block overflow-hidden text-ellipsis"
                  style="max-width: 200px; white-space: nowrap"
                  :title="url.url"
                >
                  {{ url.url }}
                </a>
              </td>
              <td class="px-6 py-4">{{ url.description || "-" }}</td>
              <td class="px-6 py-4">
                {{ formatDate(url.createdAt.toString()) }}
              </td>
              <td class="px-6 py-4">{{ url.offers?.length || 0 }} ofert</td>
              <td class="px-6 py-4">
                <button @click="editUrl(url)" class="text-blue-500 mr-2">
                  <IconPencil class="w-5 h-5" />
                </button>
                <button @click="deleteUrl(url.id)" class="text-red-500">
                  <IconTrash class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AddUrlForm from "@/components/AddUrlForm.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import { formatDate } from "../utils/formatters";
import api from "../services/api";
import { TrackedUrl } from "../types/tracked-url.types";
import IconTrash from "@/components/icons/IconTrash.vue";
import IconPencil from "@/components/icons/IconPencil.vue";

const trackedUrls = ref<TrackedUrl[]>([]);
const isLoading = ref(false);
const editData = ref<{ id: number; url: string; description: string } | null>(
  null
);

const fetchTrackedUrls = async () => {
  isLoading.value = true;
  try {
    const response = await api.get<TrackedUrl[]>("/api/tracked-urls");
    trackedUrls.value = response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania śledzonych URL-i:", error);
  } finally {
    isLoading.value = false;
  }
};

const saveUrl = async ({
  url,
  description,
  id,
}: {
  url: string;
  description: string;
  id?: number;
}) => {
  try {
    if (id) {
      await api.put(`/api/tracked-urls/${id}`, { url, description });
    } else {
      await api.post("/api/tracked-urls", { url, description });
    }
    await fetchTrackedUrls();
    editData.value = null;
  } catch (error) {
    console.error("Błąd podczas zapisu URL-a:", error);
  }
};

const deleteUrl = async (id: number) => {
  try {
    await api.delete(`/api/tracked-urls/${id}`);
    await fetchTrackedUrls();
  } catch (error) {
    console.error("Błąd podczas usuwania URL-a:", error);
  }
};

const editUrl = (url: TrackedUrl) => {
  editData.value = {
    id: url.id,
    url: url.url,
    description: url.description || "",
  };
};

onMounted(fetchTrackedUrls);
</script>
