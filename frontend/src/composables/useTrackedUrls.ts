// src/composables/useTrackedUrls.ts
import { useTrackedUrlStore } from '@/stores/trackedUrlStore';
import { storeToRefs } from 'pinia';

export function useTrackedUrls() {
    const trackedUrlStore = useTrackedUrlStore();
    const { trackedUrls, isLoading, error, editData } = storeToRefs(trackedUrlStore);
    const {
        fetchTrackedUrls,
        refreshTrackedUrls,
        saveUrl,
        deleteUrl,
        setEditData,
        clearEditData
    } = trackedUrlStore;

    return {
        trackedUrls,
        isLoading,
        error,
        editData,
        fetchTrackedUrls,
        refreshTrackedUrls,
        saveUrl,
        deleteUrl,
        setEditData,
        clearEditData
    };
}
