<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const url = ref("");
const showInput = ref(false);

const startHarvest = (): void => {
  if (!showInput.value) {
    showInput.value = true;
    return;
  }
  
  if (url.value.trim()) {
    let finalUrl = url.value.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    router.push({ path: '/content', query: { url: finalUrl } });
  }
};

const handleKeypress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    startHarvest();
  }
};
</script>

<template>
  <div class="page start-page">
    <div class="rain-background"></div>

    <div class="page-content">
      <h1 class="page-title">CodeHarvest</h1>
      
      <p class="page-description" v-if="!showInput">
        Извлекайте HTML и CSS с любого сайта. Получайте готовые стили и разметку
        в один клик.
      </p>

      <div class="form-container" v-else>
        <div class="input-group">
          <span class="input-prefix">https://</span>
          <input 
            class="input-field" 
            placeholder="site.com" 
            v-model="url"
            @keypress="handleKeypress"
            autofocus
          />
          <span class="input-icon" @click="startHarvest">
            🔗
          </span>
        </div>
        <p class="input-hint">Введите URL сайта для извлечения стилей</p>
      </div>

      <button class="btn btn-primary" @click="startHarvest">
        {{ showInput ? 'Извлечь стили' : 'Начать' }}
      </button>
    </div>
  </div>
</template>