// src/stores/trackedUrlStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';
import { TrackedUrl } from '@/types/tracked-url.types';

export const useTrackedUrlStore = defineStore('trackedUrl', () => {
    const trackedUrls = ref<TrackedUrl[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const initialized = ref(false);
    const editData = ref<{ id: number; url: string; description: string } | null>(null);

    const fetchTrackedUrls = async () => {
        // Jeśli dane już zostały pobrane, nie pobieraj ich ponownie
        if (initialized.value && trackedUrls.value.length > 0) return;

        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get<TrackedUrl[]>("/api/tracked-urls");
            trackedUrls.value = response.data;
            initialized.value = true;
        } catch (err) {
            console.error("Błąd podczas pobierania śledzonych URL-i:", err);
            error.value = 'Nie udało się pobrać śledzonych URL-i. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };

    const refreshTrackedUrls = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get<TrackedUrl[]>("/api/tracked-urls");
            trackedUrls.value = response.data;
        } catch (err) {
            console.error("Błąd podczas odświeżania śledzonych URL-i:", err);
            error.value = 'Nie udało się odświeżyć śledzonych URL-i. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };

    const saveUrl = async ({
        url,
        description,
        id,
    }: {
        url: string;
        description: string;
        id?: number;
    }) => {
        isLoading.value = true;
        error.value = null;

        try {
            if (id) {
                await api.put(`/api/tracked-urls/${id}`, { url, description });
            } else {
                await api.post("/api/tracked-urls", { url, description });
            }
            await refreshTrackedUrls();
            editData.value = null;
        } catch (err) {
            console.error("Błąd podczas zapisu URL-a:", err);
            error.value = 'Nie udało się zapisać URL-a. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };

    const deleteUrl = async (id: number) => {
        isLoading.value = true;
        error.value = null;

        try {
            await api.delete(`/api/tracked-urls/${id}`);
            await refreshTrackedUrls();
        } catch (err) {
            console.error("Błąd podczas usuwania URL-a:", err);
            error.value = 'Nie udało się usunąć URL-a. Spróbuj ponownie później.';
        } finally {
            isLoading.value = false;
        }
    };

    const setEditData = (url: TrackedUrl) => {
        editData.value = {
            id: url.id,
            url: url.url,
            description: url.description || "",
        };
    };

    const clearEditData = () => {
        editData.value = null;
    };

    return {
        trackedUrls,
        isLoading,
        error,
        editData,
        initialized,
        fetchTrackedUrls,
        refreshTrackedUrls,
        saveUrl,
        deleteUrl,
        setEditData,
        clearEditData
    };
});
