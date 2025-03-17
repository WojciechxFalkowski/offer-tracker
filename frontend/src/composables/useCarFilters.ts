// composables/useCarFilters.ts
import { useFilterOptionsStore } from '@/stores/filterOptionsStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

export function useCarFilters() {
    const filters = ref({
        // Podstawowe
        brand: "",
        model: "",
        version: "",
        minPrice: null as number | null,
        maxPrice: null as number | null,

        // Specyfikacja techniczna
        fuelType: [] as string[],
        minEngineCapacity: null as number | null,
        maxEngineCapacity: null as number | null,
        minPower: null as number | null,
        maxPower: null as number | null,
        bodyTypes: [] as string[],
        gearbox: [] as string[],
        drive: [] as string[],
        minMileage: null as number | null,
        maxMileage: null as number | null,

        // Szczegóły samochodu
        colors: [] as string[],
        doorCount: null as number | null,
        seatCount: null as number | null,
        minYear: null as number | null,
        maxYear: null as number | null,
        generation: "",
        vin: "",

        // Metadane
        startDate: null as string | null,
        endDate: null as string | null,
        sourceIds: [] as number[],

        // Zaawansowane
        minPowerToWeight: null as number | null,
        maxPowerToWeight: null as number | null,
        minAnnualMileage: null as number | null,
        maxAnnualMileage: null as number | null,
    });

    const activeFiltersCount = computed(() => {
        let count = 0;

        // Zliczanie aktywnych filtrów
        Object.entries(filters.value).forEach(([key, value]) => {
            if (
                value !== null &&
                value !== "" &&
                (Array.isArray(value) ? value.length > 0 : true)
            ) {
                count++;
            }
        });

        return count;
    });

    const formattedActiveFilters = computed(() => {
        const result = [];

        // Formatowanie aktywnych filtrów do wyświetlenia
        Object.entries(filters.value).forEach(([key, value]) => {
            if (
                value === null ||
                value === "" ||
                (Array.isArray(value) && value.length === 0)
            ) {
                return;
            }

            let label = "";
            let displayValue = "";

            // Mapowanie kluczy na etykiety
            switch (key) {
                case "brand":
                    label = "Marka";
                    displayValue = getBrandLabel(value as string);
                    break;
                case "model":
                    label = "Model";
                    displayValue = value as string;
                    break;
                case "version":
                    label = "Wersja";
                    displayValue = value as string;
                    break;
                case "minPrice":
                    label = "Cena od";
                    displayValue = `${value} zł`;
                    break;
                case "maxPrice":
                    label = "Cena do";
                    displayValue = `${value} zł`;
                    break;
                case "fuelType":
                    label = "Rodzaj paliwa";
                    displayValue = (value as string[])
                        .map((v) => {
                            const option = fuelTypeOptions.value.find((opt) => opt.value === v);
                            return option ? option.label : v;
                        })
                        .join(", ");
                    break;
                case "minEngineCapacity":
                    label = "Pojemność silnika od";
                    displayValue = `${value} cm³`;
                    break;
                case "maxEngineCapacity":
                    label = "Pojemność silnika do";
                    displayValue = `${value} cm³`;
                    break;
                case "minPower":
                    label = "Moc od";
                    displayValue = `${value} KM`;
                    break;
                case "maxPower":
                    label = "Moc do";
                    displayValue = `${value} KM`;
                    break;
                case "bodyTypes":
                    label = "Typ nadwozia";
                    displayValue = (value as string[]).join(", ");
                    break;
                case "gearbox":
                    label = "Skrzynia biegów";
                    displayValue = (value as string[])
                        .map((v) => {
                            const option = gearboxOptions.value.find((opt) => opt.value === v);
                            return option ? option.label : v;
                        })
                        .join(", ");
                    break;
                case "drive":
                    label = "Napęd";
                    displayValue = (value as string[])
                        .map((v) => {
                            const option = driveOptions.value.find((opt) => opt.value === v);
                            return option ? option.label : v;
                        })
                        .join(", ");
                    break;
                case "minMileage":
                    label = "Przebieg od";
                    displayValue = `${value} km`;
                    break;
                case "maxMileage":
                    label = "Przebieg do";
                    displayValue = `${value} km`;
                    break;
                case "colors":
                    label = "Kolor";
                    displayValue = (value as string[]).join(", ");
                    break;
                case "doorCount":
                    label = "Liczba drzwi";
                    displayValue = value as string;
                    break;
                case "seatCount":
                    label = "Liczba miejsc";
                    displayValue = value as string;
                    break;
                case "minYear":
                    label = "Rok produkcji od";
                    displayValue = value as string;
                    break;
                case "maxYear":
                    label = "Rok produkcji do";
                    displayValue = value as string;
                    break;
                case "generation":
                    label = "Generacja";
                    displayValue = value as string;
                    break;
                case "vin":
                    label = "VIN";
                    displayValue = value as string;
                    break;
                case "startDate":
                    label = "Data dodania od";
                    displayValue = new Date(value as string).toLocaleDateString();
                    break;
                case "endDate":
                    label = "Data dodania do";
                    displayValue = new Date(value as string).toLocaleDateString();
                    break;
                case "sourceIds":
                    label = "Źródło oferty";
                    displayValue = (value as number[]).join(", ");
                    break;
                case "minPowerToWeight":
                    label = "Stosunek mocy do masy od";
                    displayValue = `${value} KM/t`;
                    break;
                case "maxPowerToWeight":
                    label = "Stosunek mocy do masy do";
                    displayValue = `${value} KM/t`;
                    break;
                case "minAnnualMileage":
                    label = "Średni przebieg roczny od";
                    displayValue = `${value} km/rok`;
                    break;
                case "maxAnnualMileage":
                    label = "Średni przebieg roczny do";
                    displayValue = `${value} km/rok`;
                    break;
                default:
                    // Domyślna obsługa dla pozostałych filtrów
                    label = key;
                    displayValue = Array.isArray(value)
                        ? value.join(", ")
                        : value.toString();
            }

            result.push({
                key,
                label,
                value: displayValue,
            });
        });

        return result;
    });

    const getFiltersSectionCount = (section: string) => {
        let count = 0;

        // Zliczanie filtrów w danej sekcji
        if (section === "basic") {
            count += filters.value.brand ? 1 : 0;
            count += filters.value.model ? 1 : 0;
            count += filters.value.version ? 1 : 0;
            count += filters.value.minPrice !== null ? 1 : 0;
            count += filters.value.maxPrice !== null ? 1 : 0;
        } else if (section === "specs") {
            count += filters.value.fuelType.length > 0 ? 1 : 0;
            count += filters.value.minEngineCapacity !== null ? 1 : 0;
            count += filters.value.maxEngineCapacity !== null ? 1 : 0;
            count += filters.value.minPower !== null ? 1 : 0;
            count += filters.value.maxPower !== null ? 1 : 0;
            count += filters.value.bodyTypes.length > 0 ? 1 : 0;
            count += filters.value.gearbox.length > 0 ? 1 : 0;
            count += filters.value.drive.length > 0 ? 1 : 0;
            count += filters.value.minMileage !== null ? 1 : 0;
            count += filters.value.maxMileage !== null ? 1 : 0;
        } else if (section === "details") {
            count += filters.value.colors.length > 0 ? 1 : 0;
            count += filters.value.doorCount !== null ? 1 : 0;
            count += filters.value.seatCount !== null ? 1 : 0;
            count += filters.value.minYear !== null ? 1 : 0;
            count += filters.value.maxYear !== null ? 1 : 0;
            count += filters.value.generation ? 1 : 0;
            count += filters.value.vin ? 1 : 0;
        } else if (section === "metadata") {
            count += filters.value.startDate !== null ? 1 : 0;
            count += filters.value.endDate !== null ? 1 : 0;
            count += filters.value.sourceIds.length > 0 ? 1 : 0;
        } else if (section === "advanced") {
            count += filters.value.minPowerToWeight !== null ? 1 : 0;
            count += filters.value.maxPowerToWeight !== null ? 1 : 0;
            count += filters.value.minAnnualMileage !== null ? 1 : 0;
            count += filters.value.maxAnnualMileage !== null ? 1 : 0;
        }

        return count;
    };

    const getBrandLabel = (brandValue: string) => {
        const brand = brandOptions.value.find((b) => b.value === brandValue);
        return brand ? brand.label : brandValue;
    };


    const filterOptionsStore = useFilterOptionsStore();
    const { filterOptions } = storeToRefs(filterOptionsStore);

    const gearboxOptions = ref([
        { value: "manual", label: "Manualna" },
        { value: "automatic", label: "Automatyczna" },
        { value: "semi-automatic", label: "Półautomatyczna" },
    ]);

    const driveOptions = ref([
        { value: "fwd", label: "Przedni" },
        { value: "rwd", label: "Tylny" },
        { value: "awd", label: "Na wszystkie koła" },
        { value: "4x4", label: "4x4" },
    ]);

    const doorCountOptions = ref([
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
    ]);

    const seatCountOptions = ref([
        { value: 2, label: "2" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 7, label: "7" },
        { value: 9, label: "9" },
    ]);

    const fuelTypeOptions = ref([
        { value: "petrol", label: "Benzyna" },
        { value: "diesel", label: "Diesel" },
        { value: "hybrid", label: "Hybryda" },
        { value: "electric", label: "Elektryczny" },
        { value: "lpg", label: "LPG" },
    ]);

    const brandOptions = computed(() => {
        console.log("brandOptions");

        if (!filterOptions.value?.brands) return [];
        console.log('v1');

        return filterOptions.value.brands.map(brand => ({
            value: brand.toLowerCase(),
            label: brand
        }));
    });

    return {
        filters,
        activeFiltersCount,
        formattedActiveFilters,
        gearboxOptions,
        driveOptions,
        doorCountOptions,
        seatCountOptions,
        fuelTypeOptions,
        brandOptions,
        getFiltersSectionCount
    };
}
