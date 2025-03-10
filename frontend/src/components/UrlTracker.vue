// src/components/UrlTracker.vue
<template>
  <div class="flex flex-col items-center p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">URL Offer Tracker</h1>

    <el-card class="w-full">
      <template #header>
        <div class="font-medium">Add New URL to Track</div>
      </template>

      <el-form :model="form" @submit.prevent="submitUrl" label-position="top">
        <el-form-item label="URL to Track" required>
          <el-input
            v-model="form.url"
            placeholder="https://www.otomoto.pl/osobowe/bmw/seria-3..."
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item label="Description (Optional)">
          <el-input
            v-model="form.description"
            placeholder="BMW Series 3 Offers"
            :disabled="loading"
          />
        </el-form-item>

        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          class="w-full mt-2"
        >
          Add URL to Track
        </el-button>
      </el-form>
    </el-card>

    <div class="w-full mt-8">
      <h2 class="text-xl font-bold mb-4">Tracked URLs</h2>
      <el-table :data="trackedUrls" v-loading="loadingUrls" class="w-full">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="url" label="URL" show-overflow-tooltip />
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="createdAt" label="Added On">
          <template #default="scope">
            {{ new Date(scope.row.createdAt).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="100">
          <template #default="scope">
            <el-button
              type="danger"
              @click="deleteTrackedUrl(scope.row.id)"
              :loading="deletingId === scope.row.id"
              size="small"
              circle
              icon="Delete"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

interface TrackedUrl {
  id: number;
  url: string;
  description: string;
  createdAt: string;
}

interface FormData {
  url: string;
  description: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const form = ref<FormData>({
  url: "https://www.otomoto.pl/osobowe/audi/a4--a5/od-2019?search%5Bfilter_enum_damaged%5D=0&search%5Bfilter_enum_gearbox%5D=automatic&search%5Bfilter_enum_has_registration%5D=1&search%5Bfilter_enum_has_vin%5D=1&search%5Bfilter_enum_no_accident%5D=1&search%5Bfilter_enum_original_owner%5D=1&search%5Bfilter_enum_registered%5D=1&search%5Bfilter_enum_service_record%5D=1&search%5Bfilter_enum_transmission%5D%5B0%5D=all-wheel-auto&search%5Bfilter_enum_transmission%5D%5B1%5D=all-wheel-lock&search%5Bfilter_enum_transmission%5D%5B2%5D=all-wheel-permanent&search%5Bfilter_enum_transmission%5D%5B3%5D=rear-wheel&search%5Bfilter_float_engine_capacity%3Afrom%5D=1500&search%5Bfilter_float_engine_power%3Afrom%5D=150&search%5Badvanced_search_expanded%5D=true",
  description: "Audi A4, A5",
});

const loading = ref(false);
const loadingUrls = ref(false);
const deletingId = ref<number | null>(null);
const trackedUrls = ref<TrackedUrl[]>([]);

onMounted(async () => {
  await fetchTrackedUrls();
});

const fetchTrackedUrls = async () => {
  loadingUrls.value = true;

  try {
    const response = await axios.get(`${API_URL}/tracked-urls`);
    trackedUrls.value = response.data;
  } catch (error) {
    console.error("Error fetching tracked URLs:", error);
    ElMessage.error("Failed to fetch tracked URLs");
  } finally {
    loadingUrls.value = false;
  }
};

const submitUrl = async () => {
  if (!form.value.url) {
    ElMessage.warning("Please enter a URL to track");
    return;
  }

  if (!form.value.url.startsWith("http")) {
    ElMessage.warning("URL must start with http:// or https://");
    return;
  }

  loading.value = true;

  try {
    const response = await fetch(`${API_URL}/tracked-urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: form.value.url,
        description: form.value.description,
      }),
    });

    if (!response.ok) {
      throw new Error("Błąd sieciowy");
    }

    ElMessage.success("URL został dodany pomyślnie");
    form.value = { url: "", description: "" };
    await fetchTrackedUrls();
  } catch (error) {
    console.error("Błąd przy dodawaniu URL:", error);
    ElMessage.error("Nie udało się dodać URL");
  } finally {
    loading.value = false;
  }
};

const deleteTrackedUrl = async (id: number) => {
  deletingId.value = id;

  try {
    await axios.delete(`${API_URL}/tracked-urls/${id}`);
    ElMessage.success("URL removed from tracking");
    await fetchTrackedUrls();
  } catch (error) {
    console.error("Error deleting URL:", error);
    ElMessage.error("Failed to remove URL");
  } finally {
    deletingId.value = null;
  }
};
</script>
