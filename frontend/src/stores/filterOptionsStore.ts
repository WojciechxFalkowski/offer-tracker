// src/stores/filterOptionsStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';
import { FilterOptions } from '@/types/filter-options.types';

export const useFilterOptionsStore = defineStore('filterOptions', () => {
    const filterOptions = ref<FilterOptions | null>(null);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const initialized = ref<boolean>(false);

    const fetchFilterOptions = async (): Promise<void> => {
        // Jeśli dane już zostały pobrane, nie pobieraj ich ponownie
        if (initialized.value && filterOptions.value) return;

        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get<FilterOptions>('/api/cars/filter-options');
            filterOptions.value = response.data;
            initialized.value = true;
        } catch (err) {
            console.error('Błąd podczas pobierania opcji filtrów:', err);
            error.value = 'Nie udało się pobrać opcji filtrów. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        filterOptions,
        isLoading,
        error,
        initialized,
        fetchFilterOptions
    };
});