// src/types/filter-options.types.ts
export interface FilterOptions {
    years: string[];
    gearboxTypes: string[];
    colors: string[];
    fuelTypes: string[];
    engineTypes: string[];
    doorCounts: string[];
    seatCounts: string[];
    driveTypes: string[];
    brands: string[];
    models: { id: string, models }[];
    priceRange: {
        min: number,
        max: number
    }
}