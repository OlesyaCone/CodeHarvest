<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const messages = [
  "Анализируем HTML структуру...",
  "Извлекаем CSS стили...", 
  "Собираем цветовую палитру...",
  "Готовим результат..."
]

const currentIndex = ref(0)
const currentMessage = ref(messages[0])
const currentUrl = ref('')

let intervalId: number

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messages.length
    currentMessage.value = messages[currentIndex.value]
  }, 3000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="page">
    <div class="loader">
      <div class="page-content">
        <h1 class="page-title">CodeHarvest</h1>
        <p class="page-description">{{ currentMessage }}</p>
        <p class="loading-url" v-if="currentUrl">Анализируем: {{ currentUrl }}</p>
      </div>
      <svg
        viewBox="0 0 900 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <g id="grid">
          <g>
            <line x1="0" y1="0" x2="0" y2="100%" class="grid-line"></line>
            <line x1="100" y1="0" x2="100" y2="100%" class="grid-line"></line>
            <line x1="200" y1="0" x2="200" y2="100%" class="grid-line"></line>
            <line x1="300" y1="0" x2="300" y2="100%" class="grid-line"></line>
            <line x1="400" y1="0" x2="400" y2="100%" class="grid-line"></line>
            <line x1="500" y1="0" x2="500" y2="100%" class="grid-line"></line>
            <line x1="600" y1="0" x2="600" y2="100%" class="grid-line"></line>
            <line x1="700" y1="0" x2="700" y2="100%" class="grid-line"></line>
            <line x1="800" y1="0" x2="800" y2="100%" class="grid-line"></line>
            <line x1="900" y1="0" x2="900" y2="100%" class="grid-line"></line>
          </g>

          <g>
            <line x1="0" y1="100" x2="100%" y2="100" class="grid-line"></line>
            <line x1="0" y1="200" x2="100%" y2="200" class="grid-line"></line>
            <line x1="0" y1="300" x2="100%" y2="300" class="grid-line"></line>
            <line x1="0" y1="400" x2="100%" y2="400" class="grid-line"></line>
            <line x1="0" y1="500" x2="100%" y2="500" class="grid-line"></line>
            <line x1="0" y1="600" x2="100%" y2="600" class="grid-line"></line>
          </g>
        </g>

        <g id="browser" transform="translate(0, 200)">
          <rect
            x="250"
            y="120"
            width="400"
            height="260"
            rx="8"
            ry="8"
            class="browser-frame"
          ></rect>

          <rect
            x="250"
            y="120"
            width="400"
            height="30"
            rx="8"
            ry="8"
            class="browser-top"
          ></rect>

          <text x="450" y="140" text-anchor="middle" class="loading-text">
            Извлечение стилей...
          </text>

          <rect x="270" y="160" width="360" height="20" class="skeleton"></rect>
          <rect x="270" y="190" width="200" height="15" class="skeleton"></rect>
          <rect x="270" y="215" width="300" height="15" class="skeleton"></rect>
          <rect x="270" y="240" width="360" height="90" class="skeleton"></rect>
          <rect x="270" y="340" width="180" height="20" class="skeleton"></rect>
        </g>

        <g id="traces" transform="translate(0, 200)">
          <path d="M100 300 H250 V120" class="trace-flow"></path>
          <path d="M800 200 H650 V380" class="trace-flow"></path>
          <path d="M400 520 V380 H250" class="trace-flow"></path>
          <path d="M500 50 V120 H650" class="trace-flow"></path>
        </g>
      </svg>
    </div>
  </div>
</template>