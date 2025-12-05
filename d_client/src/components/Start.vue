<script setup lang="ts">
import { computed, ref } from "vue";
import { useUrlStore } from "../store/url";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

const urlStore = useUrlStore();
const url = ref("");
const showInput = ref(false);
const errorMessage = ref(""); 

const startHarvest = async (): Promise<void> => { 
  if (!showInput.value) {
    showInput.value = true;
    return;
  }

  if (!url.value.trim()) {
    errorMessage.value = "Введите URL сайта";
    return;
  }

  let finalUrl = url.value.trim();
  if (!finalUrl.startsWith("http")) {
    finalUrl = "https://" + finalUrl;
  }

  errorMessage.value = "";

  try {
    await urlStore.scrape(finalUrl);
  } catch (error: any) {
    console.error("Ошибка:", error);

    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error;
    } else if (error.message) {
      errorMessage.value = "Ошибка соединения с сервером";
    }
  }
};

const handleKeypress = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    startHarvest();
  }
};

const title = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value;
  }

  if (urlStore.data?.success === false) {
    const errorData = urlStore.data as { success: false; error: string };
    return errorData.error;
  }
  return "Извлекайте HTML и CSS с любого сайта. Получайте готовые стили и разметку в один клик.";
});
</script>

<template>
  <div class="page start-page">
    <div class="rain-background"></div>

    <div class="page-content">
      <h1 class="page-title">CodeHarvest</h1>

      <div class="page-description" v-if="!showInput">
        <p>
          {{ title }}
        </p>
      </div>
      
      <div class="form-container" v-else>
        <div class="input-group">
          <span class="input-prefix">https://</span>
          <input
            class="input-field"
            placeholder="https://google.com"
            v-model="url"
            @keypress="handleKeypress"
            autofocus
          />
          <span class="input-icon" @click="startHarvest"> 🔗 </span>
        </div>
    
        <p class="input-hint error" v-if="errorMessage">
          {{ errorMessage }}
        </p>
        <p class="input-hint" v-else>
          Введите URL сайта для извлечения стилей
        </p>
      </div>

      <button 
        class="btn btn-primary" 
        @click="startHarvest" 
        :disabled="urlStore.loading"
      >
        {{ showInput ? "Извлечь стили" : "Начать" }}
      </button>
    </div>
  </div>
</template>