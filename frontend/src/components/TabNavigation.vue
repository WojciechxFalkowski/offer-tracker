<template>
  <div class="mb-8">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('change-tab', tab.id)"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

defineEmits(["change-tab"]);

const tabs = [
  { id: "URLs", label: "Dodaj URL" },
  // { id: "tracked", label: "Śledzone URL-e" },
  { id: "offers", label: "Najnowsze oferty" },
];
</script>
