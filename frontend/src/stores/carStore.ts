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

    // const fetchCars = async () => {
    //     console.log('?');
        
    //     // Jeśli dane już zostały pobrane, nie pobieraj ich ponownie
    //     if (initialized.value && cars.value.length > 0) return;

    //     isLoading.value = true;
    //     error.value = null;

    //     try {
    //         const response = await api.get<{
    //             cars: Offer[],
    //             total: number,
    //         }>('/api/cars');
    //         cars.value = response.data.cars;
    //         initialized.value = true;
    //     } catch (err) {
    //         console.error('Błąd podczas pobierania ofert:', err);
    //         error.value = 'Nie udało się pobrać ofert. Spróbuj ponownie później.';
    //     } finally {
    //         isLoading.value = false;
    //     }
    // };

    const refreshCars = async () => {
        // Ta metoda wymusza odświeżenie danych
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get<{
                cars: Offer[],
                total: number,
            }>('/api/cars');
            cars.value = response.data.cars;
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
            // Poprawna serializacja tablic: make=audi&make=bmw
            const searchParams = new URLSearchParams();

            Object.entries(queryParams).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined ||
                    value === ''
                ) return;

                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        if (v !== null && v !== undefined && v !== '') {
                            searchParams.append(key, v.toString());
                        }
                    });
                } else {
                    searchParams.append(key, value.toString());
                }
            });

            const queryString = searchParams.toString();

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
        refreshCars,
        fetchFilteredCars
    };
});
