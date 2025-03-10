<template>
  <div class="container mx-auto border-b border-gray-200 mb-6">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
      <li v-for="tab in tabs" :key="tab.id" class="me-2">
        <router-link
          :to="tab.path"
          custom
          v-slot="{ isActive, href, navigate }"
        >
          <a
            :href="href"
            @click="navigate"
            class="inline-block p-4 border-b-2 rounded-t-lg transition-colors"
            :class="[
              isActive
                ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            {{ tab.label }}
          </a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { TABS } from "../constants/tabs";

const tabs = TABS;
</script>
