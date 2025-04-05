import { DEFAULT_STRING_FILTERS } from "./defaultFilters";

// src/constants/tabs.ts
export const TABS = [
    { id: "urls", label: "Śledzone URL-e", path: "/urls" },
    { id: "cars", label: "Najnowsze oferty", path: `/cars?${DEFAULT_STRING_FILTERS}` }
];
