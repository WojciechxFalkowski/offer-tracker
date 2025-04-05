// src/composables/useFilterOptions.ts
import { computed, onMounted } from 'vue';
import { useFilterOptionsStore } from '@/stores/filterOptionsStore';
import { storeToRefs } from 'pinia';

export const useFilterOptions = () => {
    const filterOptionsStore = useFilterOptionsStore();
    const { filterOptions, isLoading, error, initialized } = storeToRefs(filterOptionsStore);
    const { fetchFilterOptions } = filterOptionsStore;

    // Computed properties dla łatwiejszego dostępu do poszczególnych opcji
    const brands = computed(() => filterOptions.value?.brands || []);
    const models = computed(() => filterOptions.value?.models || {});
    const years = computed(() => filterOptions.value?.years || []);
    const gearboxTypes = computed(() => filterOptions.value?.gearboxTypes || []);
    const colors = computed(() => filterOptions.value?.colors || []);
    const fuelTypes = computed(() => filterOptions.value?.fuelTypes || []);
    const engineTypes = computed(() => filterOptions.value?.engineTypes || []);
    const doorCounts = computed(() => filterOptions.value?.doorCounts || []);
    const seatCounts = computed(() => filterOptions.value?.seatCounts || []);
    const driveTypes = computed(() => filterOptions.value?.driveTypes || []);
    const minCarPrice = computed(() => filterOptions.value?.priceRange.min || 0);
    const maxCarPrice = computed(() => filterOptions.value?.priceRange.max || 0);

    // Funkcja do pobierania modeli dla konkretnej marki
    const getModelsForBrand = (brand: string): string[] => {
        return models.value[brand] || [];
    };

    // Inicjalizacja - pobierz opcje filtrów przy montowaniu komponentu
    onMounted(() => {
        // fetchFilterOptions();
    });

    return {
        // Dane
        filterOptions,
        isLoading,
        error,
        initialized,

        // Poszczególne opcje filtrów
        brands,
        models,
        years,
        gearboxTypes,
        colors,
        fuelTypes,
        engineTypes,
        doorCounts,
        seatCounts,
        driveTypes,
        minCarPrice,
        maxCarPrice,

        // Metody
        fetchFilterOptions,
        getModelsForBrand
    };
}