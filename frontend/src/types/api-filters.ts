interface ApiFilters {
    priceFrom?: number;
    priceTo?: number;
    yearFrom?: number;
    yearTo?: number;
    make?: string | string[];
    model?: string | string[];
    trim?: string;
    fuel?: string[];
    cubicCapacity?: { min?: number; max?: number };
    power?: { min?: number; max?: number };
    category?: string[];
    gearbox?: string[];
    drivingMode?: string[];
    mileage?: { min?: number; max?: number };
    exteriorColor?: string[];
    doorCount?: number;
    numSeats?: { max?: number };
    modelDescription?: string;
    vin?: string;
    creationTime?: { min?: string; max?: string };
    customerNumber?: number[];
    powerToWeight?: { min?: number; max?: number };
    annualMileage?: { min?: number; max?: number };
    // [key: string]: any; // Dla innych, nieznanych pól
}
