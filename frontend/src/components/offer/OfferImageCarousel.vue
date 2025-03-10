<template>
  <div class="relative h-56 bg-gray-200">
    <!-- Gdy są zdjęcia -->
    <div v-if="hasImages" class="h-full">
      <div class="relative h-full">
        <!-- Główne zdjęcie -->
        <img
          :src="currentImage"
          :alt="alt"
          class="w-full h-full object-cover"
        />

        <!-- Licznik zdjęć -->
        <div
          class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full"
        >
          {{ currentImageIndex + 1 }} / {{ images.length }}
        </div>

        <!-- Przyciski nawigacji -->
        <button
          v-if="images.length > 1"
          @click="prevImage"
          class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1"
          aria-label="Poprzednie zdjęcie"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1"
          aria-label="Następne zdjęcie"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Gdy nie ma zdjęć -->
    <div v-else class="flex items-center justify-center h-full bg-gray-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span class="ml-2 text-gray-500">Brak zdjęcia</span>
    </div>

    <slot name="overlay"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => [],
  },
  alt: {
    type: String,
    default: "",
  },
});

const currentImageIndex = ref(0);
const hasImages = computed(() => props.images.length > 0);

const currentImage = computed(() => {
  if (hasImages.value) {
    return props.images[currentImageIndex.value];
  }
  return "";
});

function nextImage() {
  if (props.images.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % props.images.length;
  }
}

function prevImage() {
  if (props.images.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + props.images.length) % props.images.length;
  }
}

// Automatyczne przewijanie zdjęć
let autoplayInterval: number | null = null;

onMounted(() => {
  // if (props.images.length > 1) {
  //   autoplayInterval = setInterval(() => {
  //     nextImage();
  //   }, 5000) as unknown as number;
  // }
});

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});
</script>
