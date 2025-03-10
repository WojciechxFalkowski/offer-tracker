<template>
  <div class="advanced-filter">
    <div
      @click="isExpanded = !isExpanded"
      class="flex items-center justify-between py-2 px-1 cursor-pointer group border-b border-gray-200 mb-3"
    >
      <div class="flex items-center">
        <IconBeaker class="w-5 h-5 mr-2 text-gray-500" />
        <h3 class="text-md font-medium text-gray-700">{{ title }}</h3>

        <!-- Badge z liczbą aktywnych filtrów -->
        <span
          v-if="activeFiltersCount > 0"
          class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
        >
          {{ activeFiltersCount }}
        </span>
      </div>

      <!-- Ikona zwijania/rozwijania -->
      <div class="text-gray-400 group-hover:text-gray-600 transition-colors">
        <IconChevronDown v-if="isExpanded" class="w-5 h-5" />
        <IconChevronRight v-else class="w-5 h-5" />
      </div>
    </div>

    <!-- Zawartość zaawansowanych filtrów -->
    <div v-if="isExpanded" class="space-y-4">
      <!-- Informacja o filtrach zaawansowanych -->
      <div
        v-if="showInfo"
        class="p-3 bg-blue-50 rounded-md text-sm text-blue-700 mb-4"
      >
        <div class="flex items-start">
          <IconInformation
            class="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5"
          />
          <div>
            <p>{{ infoText }}</p>
            <button
              v-if="infoLink"
              @click="openInfoLink"
              class="mt-1 text-blue-600 hover:text-blue-800 hover:underline"
            >
              {{ infoLinkText }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sloty na filtry zaawansowane -->
      <slot></slot>

      <!-- Przyciski akcji -->
      <div
        v-if="showActions"
        class="flex justify-end space-x-3 mt-2 pt-2 border-t border-gray-200"
      >
        <button
          @click="clearFilters"
          class="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
        >
          Wyczyść filtry zaawansowane
        </button>
        <button
          @click="applyFilters"
          class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Zastosuj
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconBeaker from "../icons/IconBeaker.vue";
import IconChevronDown from "../icons/IconChevronDown.vue";
import IconChevronRight from "../icons/IconChevronRight.vue";
import IconInformation from "../icons/IconInformation.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Filtry zaawansowane",
  },
  activeFiltersCount: {
    type: Number,
    default: 0,
  },
  initiallyExpanded: {
    type: Boolean,
    default: false,
  },
  showInfo: {
    type: Boolean,
    default: true,
  },
  infoText: {
    type: String,
    default:
      "Filtry zaawansowane pozwalają na bardziej precyzyjne wyszukiwanie samochodów na podstawie złożonych kryteriów.",
  },
  infoLink: {
    type: String,
    default: "",
  },
  infoLinkText: {
    type: String,
    default: "Dowiedz się więcej",
  },
  showActions: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["clear", "apply"]);

// Stan komponentu
const isExpanded = ref(props.initiallyExpanded);

// Funkcje
const clearFilters = () => {
  emit("clear");
};

const applyFilters = () => {
  emit("apply");
};

const openInfoLink = () => {
  if (props.infoLink) {
    window.open(props.infoLink, "_blank");
  }
};
</script>
