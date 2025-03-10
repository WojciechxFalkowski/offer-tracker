<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      {{ isEditing ? "Edytuj URL" : "Dodaj nowy URL do śledzenia" }}
    </h2>

    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="url" class="block text-sm font-medium text-gray-700 mb-1">
          URL do śledzenia
        </label>
        <input
          type="url"
          id="url"
          v-model="url"
          placeholder="https://www.otomoto.pl/osobowe/bmw/seria-3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Opis (opcjonalnie)
        </label>
        <input
          type="text"
          id="description"
          v-model="description"
          placeholder="np. BMW Seria 3 G20 od 2019"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">{{
          isEditing ? "Zapisywanie..." : "Dodawanie..."
        }}</span>
        <span v-else>{{
          isEditing ? "Zapisz zmiany" : "Dodaj do śledzenia"
        }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const emit = defineEmits<{
  (
    e: "submit",
    payload: { url: string; description: string; id?: number }
  ): void;
}>();

const props = defineProps<{
  editData?: { id: number; url: string; description: string };
}>();

const isSubmitting = ref(false);
const url = ref("");
const description = ref("");

const isEditing = computed(() => !!props.editData);

// Ustawienie danych formularza do edycji, gdy są dostępne
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      url.value = newData.url;
      description.value = newData.description || "";
    } else {
      url.value = "";
      description.value = "";
    }
  },
  { immediate: true }
);

const submitForm = () => {
  if (!url.value) return;

  isSubmitting.value = true;

  emit("submit", {
    url: url.value,
    description: description.value,
    id: props.editData?.id,
  });

  url.value = "";
  description.value = "";
  isSubmitting.value = false;
};
</script>
