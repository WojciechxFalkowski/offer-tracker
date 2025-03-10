// Funkcja przygotowująca filtry do URL
export const prepareFiltersForUrl = (filters: Record<string, any>) => {
    const urlParams: Record<string, string> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
        ) {
            return;
        }

        // Dla tablic, łącz wartości przecinkami
        if (Array.isArray(value)) {
            urlParams[key] = value.join(",");
        } else {
            urlParams[key] = value.toString();
        }
    });

    return urlParams;
};

export const prepareFiltersForApi = (filters: Record<string, any>): ApiFilters => {
    const apiFilters: ApiFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
        ) {
            return;
        }

        // Mapowanie kluczy na parametry API
        switch (key) {
            case "minPrice":
                if (typeof value === "number") {
                    apiFilters.priceFrom = value;
                }
                break;
            case "maxPrice":
                if (typeof value === "number") {
                    apiFilters.priceTo = value;
                }
                break;
            case "minYear":
                if (typeof value === "number") {
                    apiFilters.yearFrom = value;
                }
                break;
            case "maxYear":
                if (typeof value === "number") {
                    apiFilters.yearTo = value;
                }
                break;
            case "brand":
                if (typeof value === "string") {
                    apiFilters.make = value;
                }
                break;
            case "model":
                if (typeof value === "string") {
                    apiFilters.model = value;
                }
                break;
            case "version":
                if (typeof value === "string") {
                    apiFilters.trim = value;
                }
                break;
            case "fuelType":
                if (Array.isArray(value)) {
                    apiFilters.fuel = value as string[];
                }
                break;
            case "minEngineCapacity":
                if (typeof value === "number") {
                    if (!apiFilters.cubicCapacity) apiFilters.cubicCapacity = {};
                    apiFilters.cubicCapacity.min = value;
                }
                break;
            case "maxEngineCapacity":
                if (typeof value === "number") {
                    if (!apiFilters.cubicCapacity) apiFilters.cubicCapacity = {};
                    apiFilters.cubicCapacity.max = value;
                }
                break;
            case "minPower":
                if (typeof value === "number") {
                    if (!apiFilters.power) apiFilters.power = {};
                    apiFilters.power.min = value;
                }
                break;
            case "maxPower":
                if (typeof value === "number") {
                    if (!apiFilters.power) apiFilters.power = {};
                    apiFilters.power.max = value;
                }
                break;
            case "bodyTypes":
                if (Array.isArray(value)) {
                    apiFilters.category = value as string[];
                }
                break;
            case "gearbox":
                if (Array.isArray(value)) {
                    apiFilters.gearbox = value as string[];
                }
                break;
            case "drive":
                if (Array.isArray(value)) {
                    apiFilters.drivingMode = value as string[];
                }
                break;
            case "minMileage":
                if (typeof value === "number") {
                    if (!apiFilters.mileage) apiFilters.mileage = {};
                    apiFilters.mileage.min = value;
                }
                break;
            case "maxMileage":
                if (typeof value === "number") {
                    if (!apiFilters.mileage) apiFilters.mileage = {};
                    apiFilters.mileage.max = value;
                }
                break;
            case "colors":
                if (Array.isArray(value)) {
                    apiFilters.exteriorColor = value as string[];
                }
                break;
            case "doorCount":
                if (typeof value === "number") {
                    apiFilters.doorCount = value;
                }
                break;
            case "seatCount":
                if (typeof value === "number") {
                    if (!apiFilters.numSeats) apiFilters.numSeats = {};
                    apiFilters.numSeats.max = value;
                }
                break;
            case "generation":
                if (typeof value === "string") {
                    apiFilters.modelDescription = value;
                }
                break;
            case "vin":
                if (typeof value === "string") {
                    apiFilters.vin = value;
                }
                break;
            case "startDate":
                if (typeof value === "string") {
                    if (!apiFilters.creationTime) apiFilters.creationTime = {};
                    apiFilters.creationTime.min = value;
                }
                break;
            case "endDate":
                if (typeof value === "string") {
                    if (!apiFilters.creationTime) apiFilters.creationTime = {};
                    apiFilters.creationTime.max = value;
                }
                break;
            case "sourceIds":
                if (Array.isArray(value)) {
                    apiFilters.customerNumber = value
                        .map((id) => (typeof id === "number" ? id : parseInt(id, 10)))
                        .filter((id) => !isNaN(id));
                }
                break;
            case "minPowerToWeight":
                if (typeof value === "number") {
                    if (!apiFilters.powerToWeight) apiFilters.powerToWeight = {};
                    apiFilters.powerToWeight.min = value;
                }
                break;
            case "maxPowerToWeight":
                if (typeof value === "number") {
                    if (!apiFilters.powerToWeight) apiFilters.powerToWeight = {};
                    apiFilters.powerToWeight.max = value;
                }
                break;
            case "minAnnualMileage":
                if (typeof value === "number") {
                    if (!apiFilters.annualMileage) apiFilters.annualMileage = {};
                    apiFilters.annualMileage.min = value;
                }
                break;
            case "maxAnnualMileage":
                if (typeof value === "number") {
                    if (!apiFilters.annualMileage) apiFilters.annualMileage = {};
                    apiFilters.annualMileage.max = value;
                }
                break;
            default:
                // Domyślnie użyj tego samego klucza
                apiFilters[key] = value;
        }
    });

    return apiFilters;
};