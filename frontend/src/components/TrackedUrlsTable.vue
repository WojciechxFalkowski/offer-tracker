<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            URL
          </th>
          <th
            class="sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Opis
          </th>
          <th
            class="hidden md:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Data dodania
          </th>
          <th
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Oferty
          </th>
          <th
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Akcje
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="url in trackedUrls" :key="url.id" class="hover:bg-gray-50">
          <td
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm"
          >
            {{ url.id }}
          </td>
          <td
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm max-w-[50px] sm:max-w-[150px] md:max-w-[150px] lg:max-w-[400px]"
          >
            <a
              :href="url.url"
              target="_blank"
              class="text-blue-600 hover:text-blue-800 hover:underline block overflow-hidden text-ellipsis"
              :title="url.url"
            >
              {{ url.url }}
            </a>
          </td>
          <td
            class="sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm"
          >
            {{ url.description || "-" }}
          </td>
          <td
            class="hidden md:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm"
          >
            {{ formatDate(url.createdAt.toString()) }}
          </td>
          <td
            class="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm"
          >
            {{ url.matchingCarsCount }}
          </td>
          <td class="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap">
            <div class="relative">
              <button
                @click.stop="toggleDropdown(url.id)"
                data-dropdown-button
                class="text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
              >
                <IconDotsVertical class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div
                v-if="openDropdownId === url.id"
                v-on-click-outside="() => (openDropdownId = null)"
                class="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200"
              >
                <button
                  @click="
                    $emit('edit', url);
                    openDropdownId = null;
                  "
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <IconPencil class="w-4 h-4 mr-2" />
                  Edytuj
                </button>

                <button
                  @click="
                    openBrandModelModal(url);
                    openDropdownId = null;
                  "
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <IconCar class="w-4 h-4 mr-2" />
                  Marka/Model
                </button>

                <button
                  @click="
                    $emit('delete', url.id);
                    openDropdownId = null;
                  "
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <IconTrash class="w-4 h-4 mr-2" />
                  Usuń
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <TrackedUrlBrandModelModal
      v-if="selectedUrl"
      :is-open="isBrandModelModalOpen"
      :tracked-url="selectedUrl"
      @close="closeBrandModelModal"
      @save="handleBrandModelSave"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/formatters";
import { TrackedUrl } from "@/types/tracked-url.types";
import IconTrash from "@/components/icons/IconTrash.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import { ref } from "vue";
import { onClickOutside, useEventListener } from "@vueuse/core";
import IconDotsVertical from "@/components/icons/IconDotsVertical.vue";
import { vOnClickOutside } from "@vueuse/components";
import IconCar from "@/components/icons/IconCar.vue";
import TrackedUrlBrandModelModal from "./TrackedUrlBrandModelModal.vue";
import api from "@/services/api";

defineProps({
  trackedUrls: {
    type: Array as () => TrackedUrl[],
    required: true,
  },
});

const emit = defineEmits(["edit", "delete", "refresh"]);

const openDropdownId = ref<number | null>(null);
const isBrandModelModalOpen = ref(false);
const selectedUrl = ref<TrackedUrl | null>(null);

const toggleDropdown = (id: number) => {
  openDropdownId.value = openDropdownId.value === id ? null : id;
};

const openBrandModelModal = (url: TrackedUrl) => {
  selectedUrl.value = url;
  isBrandModelModalOpen.value = true;
};

const closeBrandModelModal = () => {
  isBrandModelModalOpen.value = false;
  selectedUrl.value = null;
};

const handleBrandModelSave = async (data: { brand: string; model: string }) => {
  if (!selectedUrl.value) return;

  try {
    await api.put(`/api/tracked-urls/${selectedUrl.value.id}`, data);
    // Emit an event to refresh the data
    emit("refresh");
  } catch (error) {
    console.error("Error updating brand/model:", error);
  } finally {
    closeBrandModelModal();
  }
};

// Zamykaj dropdown przy kliknięciu gdziekolwiek
useEventListener(
  document,
  "click",
  (event) => {
    // Sprawdź czy kliknięcie było na przycisku dropdown
    const isDropdownButton = (event.target as HTMLElement).closest(
      "[data-dropdown-button]"
    );

    // Jeśli nie kliknięto przycisku dropdown, zamknij dropdown
    if (!isDropdownButton && openDropdownId.value !== null) {
      openDropdownId.value = null;
    }
  },
  { capture: true }
);
</script>
