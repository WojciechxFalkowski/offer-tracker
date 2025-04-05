// src/composables/useCars.ts
import { useCarStore } from '@/stores/carStore';
import { storeToRefs } from 'pinia';

export function useCars() {
    const carStore = useCarStore();
    const { cars, isLoading, error } = storeToRefs(carStore);
    const { refreshCars } = carStore;

    return {
        cars,
        isLoading,
        error,
        refreshCars
    };
}
