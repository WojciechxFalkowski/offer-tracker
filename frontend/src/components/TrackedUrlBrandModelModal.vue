<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 class="text-xl font-semibold mb-4">Wybierz markę i model</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Marka</label
        >
        <select
          v-model="selectedBrand"
          class="w-full p-2 border rounded-md"
          @change="selectedModel = null"
        >
          <option value="">Wybierz markę</option>
          <option v-for="brand in brands" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Model</label
        >
        <select
          v-model="selectedModel"
          class="w-full p-2 border rounded-md"
          :disabled="!selectedBrand"
        >
          <option value="">Wybierz model</option>
          <option v-for="model in brandModels" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </div>

      <div class="flex justify-end space-x-2">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Anuluj
        </button>
        <button
          @click="saveChanges"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          :disabled="!selectedBrand || !selectedModel"
        >
          Zapisz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { TrackedUrl } from "@/types/tracked-url.types";
import getBrandsAndModels from "@/services/cars";

const props = defineProps<{
  isOpen: boolean;
  trackedUrl: TrackedUrl;
}>();

const emit = defineEmits(["close", "save"]);

const brands = ref<string[]>([]);
const models = ref<{ id: string; models }[]>([]);
const selectedBrand = ref<string>("");
const selectedModel = ref<string>("");
const brandModels = computed(() => {
  const test = models.value.find(
    (model) => model.id === selectedBrand.value
  )?.models;
  return test;
});

onMounted(() => {
  fetchBrandsAndModels();
});
// Fetch brands and models when modal opens
const fetchBrandsAndModels = async () => {
  try {
    const response = await getBrandsAndModels();
    brands.value = response.brands;
    models.value = response.models;

    // Set initial values if they exist
    selectedBrand.value = props.trackedUrl.brand || "";
    selectedModel.value = props.trackedUrl.model || "";
  } catch (error) {
    console.error("Error fetching brands and models:", error);
  }
};

const closeModal = () => {
  emit("close");
};

const saveChanges = () => {
  emit("save", {
    brand: selectedBrand.value,
    model: selectedModel.value,
  });
};
</script>
