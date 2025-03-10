// src/stores/carStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';
import { Offer } from '@/types/offer.types';

export const useCarStore = defineStore('car', () => {
    const cars = ref<Offer[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const initialized = ref(false);

    const fetchCars = async () => {
        // Jeśli dane już zostały pobrane, nie pobieraj ich ponownie
        if (initialized.value && cars.value.length > 0) return;

        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get<Offer[]>('/api/cars');
            cars.value = response.data;
            initialized.value = true;
        } catch (err) {
            console.error('Błąd podczas pobierania ofert:', err);
            error.value = 'Nie udało się pobrać ofert. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };

    const refreshCars = async () => {
        // Ta metoda wymusza odświeżenie danych
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get<Offer[]>('/api/cars');
            cars.value = response.data;
        } catch (err) {
            console.error('Błąd podczas odświeżania ofert:', err);
            error.value = 'Nie udało się odświeżyć ofert. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };


    const fetchFilteredCars = async (queryParams) => {
        isLoading.value = true;
        error.value = null;

        try {
            // Konwertuj parametry zapytania na string zapytania
            const queryString = new URLSearchParams(
                Object.entries(queryParams)
                    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
                    .reduce((obj, [key, value]) => {
                        obj[key] = Array.isArray(value) ? value.join(',') : value;
                        return obj;
                    }, {})
            ).toString();

            const response = await api.get(`/api/cars?${queryString}`);
            cars.value = response.data.cars || [];

            return {
                cars: response.data.cars || [],
                total: response.data.total || 0,
                page: response.data.page || 1,
                pageSize: response.data.pageSize || 10
            };
        } catch (err) {
            console.error('Błąd podczas pobierania filtrowanych samochodów:', err);
            error.value = 'Nie udało się pobrać danych. Spróbuj ponownie później.';
            return { cars: [], total: 0, page: 1, pageSize: 10 };
        } finally {
            isLoading.value = false;
        }
    };

    return {
        cars,
        isLoading,
        error,
        initialized,
        fetchCars,
        refreshCars,
        fetchFilteredCars
    };
});
