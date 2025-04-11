<template>
  <ContainerWrapper>
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Oferty samochodów</h1>

      <!-- Przycisk otwierający filtry z licznikiem -->
      <FilterDrawer
        v-if="!isLoadingFilters"
        v-model="filters"
        :activeFiltersCount="activeFiltersCount"
        @apply="applyFilters"
        @clear="clearAllFilters"
      >
        <!-- Sekcja sortowania -->
        <div class="mb-6 pb-4 border-b border-gray-200">
          <SortingOptions v-model="sorting" @change="updateSorting" />
        </div>

        <!-- Sekcja filtrów podstawowych -->
        <FilterSection
          title="Podstawowe"
          :activeFiltersCount="getFiltersSectionCount('basic')"
          :icon="IconBasic"
        >
          <!-- <TextFilter
            label="Marka"
            v-model="filters.brand"
            :options="brandOptions"
            @change="onBrandChange"
          /> -->

          <div>
            <label
              for="filter-brand"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Brand
            </label>
            <MultiSelect
              id="filter-brand"
              v-model="filters.brand"
              :options="
                brandOptions.map((brandOption) => ({
                  name: brandOption.label,
                  code: brandOption.value,
                }))
              "
              optionLabel="name"
              optionValue="code"
              filter
              class="w-full"
            />
          </div>

          <div>
            <label
              for="filter-model"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Model
            </label>
            <MultiSelect
              id="filter-model"
              v-model="filters.model"
              :options="modelOptions"
              optionLabel="label"
              filter
              optionValue="value"
              optionGroupLabel="label"
              optionGroupChildren="items"
              class="w-full"
            >
              <template #optiongroup="slotProps">
                <div class="flex items-center">
                  <img
                    :alt="slotProps.option.label"
                    src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                    :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`"
                    style="width: 18px"
                  />
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </MultiSelect>
          </div>

          <CarPriceFilter
            :min="priceRange.min"
            :max="priceRange.max"
            v-model:priceMin="filters.minPrice"
            v-model:priceMax="filters.maxPrice"
          />

          <div>
            <label
              for="filter-fuel-type"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Rodzaj paliwa
            </label>
            <MultiSelect
              id="filter-fuel-type"
              v-model="filters.fuelType"
              :options="fuelTypeOptions"
              optionLabel="label"
              optionValue="value"
              filter
              class="w-full"
            />
          </div>

          <div>
            <label
              for="filter-year-from"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Rok produkcji od
            </label>
            <MultiSelect
              id="filter-year-from"
              v-model="filters.minYear"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              filter
              class="w-full"
            />
          </div>

          <div>
            <label
              for="filter-year-to"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Rok produkcji do
            </label>
            <MultiSelect
              id="filter-year-to"
              v-model="filters.maxYear"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              filter
              class="w-full"
            />
          </div>

          <!-- <TextFilter
            label="Wersja"
            v-model="filters.version"
            :options="versionOptions"
            :disabled="!filters.model"
          /> -->

          <!-- <PriceRangeFilter
            label="Cena"
            v-model:min="filters.minPrice"
            v-model:max="filters.maxPrice"
            :minLimit="0"
            :maxLimit="1000000"
            :step="5000"
            currency="zł"
          /> -->
        </FilterSection>

        <!-- Sekcja filtrów specyfikacji technicznej -->
        <!-- <FilterSection
          title="Specyfikacja techniczna"
          :activeFiltersCount="getFiltersSectionCount('specs')"
          :icon="IconEngine"
        > -->
        <!-- <SelectFilter
            label="Rodzaj paliwa"
            v-model="filters.fuelType"
            :options="fuelTypeOptions"
            :multiple="true"
          /> -->

        <!-- <RangeFilter
            label="Pojemność silnika"
            v-model:min="filters.minEngineCapacity"
            v-model:max="filters.maxEngineCapacity"
            :minLimit="500"
            :maxLimit="8000"
            :step="100"
            unit="cm³"
          /> -->

        <!-- <RangeFilter
            label="Moc silnika"
            v-model:min="filters.minPower"
            v-model:max="filters.maxPower"
            :minLimit="50"
            :maxLimit="1000"
            :step="10"
            unit="KM"
          /> -->

        <!-- <BodyTypeFilter label="Typ nadwozia" v-model="filters.bodyTypes" /> -->

        <!-- <SelectFilter
            label="Skrzynia biegów"
            v-model="filters.gearbox"
            :options="gearboxOptions"
            :multiple="true"
          /> -->

        <!-- <SelectFilter
            label="Napęd"
            v-model="filters.drive"
            :options="driveOptions"
            :multiple="true"
          /> -->

        <!-- <RangeFilter
            label="Przebieg"
            v-model:min="filters.minMileage"
            v-model:max="filters.maxMileage"
            :minLimit="0"
            :maxLimit="500000"
            :step="5000"
            unit="km"
          /> -->
        <!-- </FilterSection> -->

        <!-- Sekcja filtrów szczegółów samochodu -->
        <!-- <FilterSection
          title="Szczegóły samochodu"
          :activeFiltersCount="getFiltersSectionCount('details')"
          :icon="IconDetails"
          :initiallyCollapsed="true"
        >
          <ColorFilter label="Kolor" v-model="filters.colors" />

          <NumberFilter
            label="Liczba drzwi"
            :v-model="filters.doorCount"
            :options="doorCountOptions"
          />

          <NumberFilter
            label="Liczba miejsc"
            :v-model="filters.seatCount"
            :options="seatCountOptions"
          />

          <YearRangeFilter
            label="Rok produkcji"
            v-model:min="filters.minYear"
            v-model:max="filters.maxYear"
            :minYear="1990"
          />

          <GenerationFilter
            label="Generacja"
            v-model="filters.generation"
            :selectedBrand="filters.brand"
            :selectedModel="filters.model"
          />

          <VinFilter label="Numer VIN" v-model="filters.vin" />
        </FilterSection> -->

        <!-- Sekcja filtrów metadanych -->
        <!-- <FilterSection
          title="Metadane"
          :activeFiltersCount="getFiltersSectionCount('metadata')"
          :icon="IconMetadata"
          :initiallyCollapsed="true"
        >
          <DateRangeFilter
            label="Data dodania oferty"
            v-model:startDate="filters.startDate"
            v-model:endDate="filters.endDate"
          />

          <SourceFilter label="Źródło oferty" v-model="filters.sourceIds" />
        </FilterSection> -->

        <!-- Sekcja filtrów zaawansowanych -->
        <!-- <AdvancedFilter
          :activeFiltersCount="getFiltersSectionCount('advanced')"
          @clear="clearAdvancedFilters"
          @apply="applyFilters"
        >
          <CalculatedRangeFilter
            label="Stosunek mocy do masy"
            v-model:min="filters.minPowerToWeight"
            v-model:max="filters.maxPowerToWeight"
            :minLimit="50"
            :maxLimit="500"
            :step="10"
            unit="KM/t"
            infoText="Ten filtr oblicza stosunek mocy silnika do masy pojazdu, co jest wskaźnikiem dynamiki jazdy."
          />

          <CalculatedRangeFilter
            label="Średni przebieg roczny"
            v-model:min="filters.minAnnualMileage"
            v-model:max="filters.maxAnnualMileage"
            :minLimit="0"
            :maxLimit="100000"
            :step="1000"
            unit="km/rok"
            infoText="Ten filtr oblicza średni roczny przebieg pojazdu na podstawie całkowitego przebiegu i wieku samochodu."
          />
        </AdvancedFilter> -->
      </FilterDrawer>
    </div>

    <!-- Aktywne filtry -->
    <ActiveFilters
      v-if="formattedActiveFilters.length > 0"
      :filters="formattedActiveFilters"
      @remove="removeFilter"
      @clear-all="clearAllFilters"
      class="mb-4"
    />

    <!-- Wyniki wyszukiwania -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        class="p-6 border-b border-gray-200 flex justify-between items-center"
      >
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Znalezione oferty</h2>
          <p class="text-sm text-gray-500 mt-1">
            Znaleziono {{ totalCars }} ofert spełniających kryteria
          </p>
        </div>

        <!-- Sortowanie w widoku mobilnym -->
        <div class="sm:hidden">
          <SortingOptions v-model="sorting" @change="updateSorting" />
        </div>
      </div>

      <!-- Loader podczas ładowania -->
      <div v-if="isLoading" class="p-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FilterSkeleton v-for="i in 6" :key="i" :showSlider="false" />
        </div>
      </div>

      <!-- Brak wyników -->
      <div v-else-if="cars.length === 0" class="p-8 text-center">
        <div class="text-gray-500">
          <IconEmptyResults class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 class="text-lg font-medium mb-2">Brak wyników</h3>
          <p class="mb-4">
            Nie znaleziono ofert spełniających podane kryteria.
          </p>

          <button
            @click="() => clearAllFilters(true)"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Wyczyść wszystkie filtry
          </button>
        </div>
      </div>

      <!-- Lista samochodów -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
      >
        <CarCard v-for="car in cars" :key="car.id" :car="car" />
      </div>

      <!-- Paginacja -->
      <!-- Paginacja -->
      <div v-if="totalPages > 1" class="p-4 border-t border-gray-200">
        <div class="flex justify-center">
          <Pagination
            :current-page="page"
            :total-pages="totalPages"
            @page-change="changePage"
          />
        </div>
      </div>
    </div>
  </ContainerWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCarStore } from "@/stores/carStore";
import { storeToRefs } from "pinia";

// Importy komponentów
import FilterDrawer from "@/components/filters/FilterDrawer.vue";
import FilterSection from "@/components/filters/FilterSection.vue";
import SortingOptions from "@/components/filters/SortingOptions.vue";
import TextFilter from "@/components/filters/TextFilter.vue";
import PriceRangeFilter from "@/components/filters/PriceRangeFilter.vue";
import SelectFilter from "@/components/filters/SelectFilter.vue";
import RangeFilter from "@/components/filters/RangeFilter.vue";
import BodyTypeFilter from "@/components/filters/BodyTypeFilter.vue";
import ColorFilter from "@/components/filters/ColorFilter.vue";
import NumberFilter from "@/components/filters/NumberFilter.vue";
import YearRangeFilter from "@/components/filters/YearRangeFilter.vue";
import GenerationFilter from "@/components/filters/GenerationFilter.vue";
import VinFilter from "@/components/filters/VinFilter.vue";
import DateRangeFilter from "@/components/filters/DateRangeFilter.vue";
import SourceFilter from "@/components/filters/SourceFilter.vue";
import AdvancedFilter from "@/components/filters/AdvancedFilter.vue";
import CalculatedRangeFilter from "@/components/filters/CalculatedRangeFilter.vue";
import ActiveFilters from "@/components/filters/ActiveFilters.vue";
import FilterCounter from "@/components/filters/FilterCounter.vue";
import FilterSkeleton from "@/components/filters/FilterSkeleton.vue";
import CarCard from "@/components/car/CarCard.vue";
import ContainerWrapper from "@/components/ContainerWrapper.vue";
import Pagination from "@/components/Pagination.vue";
import CarPriceFilter from "@/components/filters/CarPriceFilter.vue";
// Importy ikon
import IconBasic from "@/components/icons/IconBasic.vue";
import IconEngine from "@/components/icons/IconEngine.vue";
import IconDetails from "@/components/icons/IconDetails.vue";
import IconMetadata from "@/components/icons/IconMetadata.vue";
import IconEmptyResults from "@/components/icons/IconEmptyResults.vue";
import { prepareFiltersForApi, prepareFiltersForUrl } from "@/utils/filters";
import { useCarFilters } from "@/composables/useCarFilters";
import { MultiSelect, FloatLabel } from "primevue";

const {
  filters,
  activeFiltersCount,
  formattedActiveFilters,
  gearboxOptions,
  driveOptions,
  doorCountOptions,
  seatCountOptions,
  fuelTypeOptions,
  brandOptions,
  yearOptions,
  priceRange,
  isLoadingFilters,
  getFiltersSectionCount,
  minCarPrice,
  maxCarPrice,
  filterOptions,
} = useCarFilters();
// Router
const router = useRouter();
const route = useRoute();

// Store
const carStore = useCarStore();
const { cars, isLoading } = storeToRefs(carStore);
const { fetchFilteredCars } = carStore;

// Flaga zapobiegająca zapętleniu przy aktualizacji URL
const isUpdatingUrl = ref(false);

const sorting = ref({
  field: "publishedDate",
  direction: "desc",
});

const page = ref(1);
const pageSize = ref(12);
const totalCars = ref(0);
const totalPages = ref(1);

// Funkcje do zarządzania URL
const updateUrlFromFilters = () => {
  isUpdatingUrl.value = true;

  // Krok 1: Pobierz URLSearchParams
  const urlSearchParams = prepareFiltersForUrl(filters.value);

  // Krok 2: Dodaj sortowanie i paginację
  urlSearchParams.set("sort", sorting.value.field);
  urlSearchParams.set("order", sorting.value.direction);
  if (page.value > 1) {
    urlSearchParams.set("page", page.value.toString());
  }

  // Krok 3: Zamień na zwykły obiekt
  const queryParams: Record<string, string | string[]> = {};
  urlSearchParams.forEach((value, key) => {
    // Obsługa wielu wartości dla tego samego klucza
    if (queryParams[key]) {
      if (Array.isArray(queryParams[key])) {
        (queryParams[key] as string[]).push(value);
      } else {
        queryParams[key] = [queryParams[key] as string, value];
      }
    } else {
      queryParams[key] = value;
    }
  });

  console.log("queryParams", queryParams);

  // Krok 4: Zmień URL
  router.push({
    query: queryParams,
  });

  // Resetuj flagę po krótkim czasie
  setTimeout(() => {
    isUpdatingUrl.value = false;
  }, 50);
};

// Funkcja wczytująca filtry z URL
const loadFiltersFromUrl = () => {
  const query = route.query;

  // Resetuj filtry
  clearAllFilters(false); // false oznacza, że nie aktualizujemy URL

  // Wczytaj filtry z URL
  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;

    if (key === "sort") {
      sorting.value.field = value.toString();
    } else if (key === "order") {
      sorting.value.direction = value.toString();
    } else if (key === "page") {
      page.value = parseInt(value.toString(), 10) || 1;
    } else {
      // Sprawdź, czy klucz istnieje w filtrach
      if (key in filters.value) {
        const stringValue = value.toString();

        // Sprawdź, czy wartość powinna być tablicą
        if (Array.isArray(filters.value[key])) {
          filters.value[key] = stringValue.split(",");
        }
        // Sprawdź, czy wartość powinna być liczbą
        else if (
          typeof filters.value[key] === "number" ||
          key.startsWith("min") ||
          key.startsWith("max")
        ) {
          filters.value[key] = parseFloat(stringValue) || null;
        } else {
          filters.value[key] = stringValue;
        }
      }
    }
  });
};

const modelOptions = computed(() => {
  return filterOptions.value.models.map((model) => {
    return {
      label: model.id,
      code: model.id,
      items: model.models.map((modelElement) => {
        return {
          label: modelElement,
          value: modelElement,
        };
      }),
    };
  });
});

const applyFilters = async () => {
  page.value = 1; // Resetuj stronę przy zmianie filtrów
  updateUrlFromFilters(); // Aktualizuj URL
  await fetchCars();
};

const updateSorting = async () => {
  updateUrlFromFilters(); // Aktualizuj URL
  await fetchCars();
};

const removeFilter = (key: string) => {
  // Resetuj konkretny filtr
  if (Array.isArray(filters.value[key])) {
    filters.value[key] = [];
  } else if (key.startsWith("min") || key.startsWith("max")) {
    filters.value[key] = null;
  } else {
    filters.value[key] = "";
  }

  updateUrlFromFilters(); // Aktualizuj URL
  fetchCars();
};

const clearAllFilters = (updateUrl = true) => {
  // Resetuj wszystkie filtry
  Object.keys(filters.value).forEach((key) => {
    if (Array.isArray(filters.value[key])) {
      filters.value[key] = [];
    } else if (key.startsWith("min") || key.startsWith("max")) {
      filters.value[key] = null;
    } else {
      filters.value[key] = "";
    }
  });

  if (updateUrl) {
    updateUrlFromFilters(); // Aktualizuj URL
    fetchCars();
  }
};

const clearAdvancedFilters = () => {
  // Resetuj tylko filtry zaawansowane
  filters.value.minPowerToWeight = null;
  filters.value.maxPowerToWeight = null;
  filters.value.minAnnualMileage = null;
  filters.value.maxAnnualMileage = null;

  updateUrlFromFilters(); // Aktualizuj URL
};

const fetchCars = async () => {
  // Przygotuj parametry zapytania
  const queryParams = {
    page: page.value,
    pageSize: pageSize.value,
    sort: sorting.value.field,
    order: sorting.value.direction,
    ...prepareFiltersForApi(filters.value),
  };

  // Pobierz dane
  const result = await fetchFilteredCars(queryParams);

  // Aktualizuj dane paginacji
  totalCars.value = result.total || 0;
  totalPages.value = Math.ceil(totalCars.value / pageSize.value);
};

// Obserwuj zmiany w URL i aktualizuj filtry
watch(
  () => route.query,
  () => {
    // Jeśli zmiana URL pochodzi z zewnątrz (np. przycisk wstecz)
    if (!isUpdatingUrl.value) {
      console.log("watch");

      loadFiltersFromUrl();
      fetchCars();
    }
  },
  { deep: true }
);

// Obserwuj zmiany strony
watch(page, () => {
  console.log("watch v2");
  updateUrlFromFilters();
  fetchCars();
});

// Inicjalizacja
onMounted(() => {
  // Wczytaj filtry z URL
  loadFiltersFromUrl();

  // Pobierz dane
  fetchCars();
});

const changePage = (newPage: number) => {
  page.value = newPage;
  updateUrlFromFilters(); // Aktualizuj URL z nowym numerem strony
  fetchCars(); // Pobierz dane dla nowej strony
};
</script>
