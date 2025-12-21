<script setup lang="ts">
import { useUrlStore } from "../../../store/url";
import { ref, computed } from "vue";

const urlStore = useUrlStore();
const copied = ref<Record<string, boolean>>({});

const componentCards = computed(() => {
  if (!urlStore.data?.allComponents?.components) return [];
  
  return urlStore.data.allComponents.components.map((comp, index) => {
    const className = comp.class?.[0]?.name || `component-${index}`;
    return {
      type: `component-${index}`,
      title: `${className}.css`,
      content: comp.css || "/* CSS не найден */",
      html: comp.html || "<!-- HTML не найден -->",
      position: comp.class?.[0]?.position || 0,
    };
  });
});

const locationCards = computed(() => {
  if (!urlStore.data?.allComponents?.location) return [];
  
  const loc = urlStore.data.allComponents.location;
  return [
    {
      type: "location-html",
      title: "structure.html",
      content: loc.html || "<!-- HTML структура не найдена -->",
    },
    {
      type: "location-css", 
      title: "layout.css",
      content: loc.css || "/* CSS расположения не найдено */",
    },
    {
      type: "location-classes",
      title: "classes.json", 
      content: JSON.stringify(loc.class || [], null, 2),
    }
  ];
});

const copyItem = (text: string, key: string) => {
  if (!text) return;
  
  navigator.clipboard.writeText(text).then(() => {
    copied.value[key] = true;
    setTimeout(() => {
      copied.value[key] = false;
    }, 2000);
  });
};
</script>

<template>
  <div class="сomponents">
    <div v-if="locationCards.length > 0">
      <h2 class="section-title">Расположение</h2>
      <p class="section-description">Структура страницы</p>
      
      <div class="cards-container">
        <div v-for="card in locationCards" :key="card.type" class="card-item">
          <div class="card">
            <div class="header">
              <div class="top">
                <div class="top-left">
                  <div class="circle">
                    <span class="red circle2"></span>
                  </div>
                  <div class="circle">
                    <span class="yellow circle2"></span>
                  </div>
                  <div class="circle">
                    <span class="green circle2"></span>
                  </div>
                  <div class="title">
                    <p id="title2">{{ card.title }}</p>
                  </div>
                </div>
                <button
                  class="copy"
                  @click="copyItem(card.content, card.type)"
                  :class="{ copied: copied[card.type] }"
                >
                  <span>
                    <svg v-if="!copied[card.type]" class="clipboard">...</svg>
                    <svg v-if="copied[card.type]" class="checkmark">...</svg>
                  </span>
                </button>
              </div>
            </div>
            <div class="code-container">
              <textarea class="area" readonly>{{ card.content }}</textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="componentCards.length > 0">
      <h2 class="section-title">Компоненты (стили)</h2>
      <p class="section-description">CSS классы как отдельные компоненты</p>
      
      <div class="cards-container">
        <div v-for="card in componentCards" :key="card.type" class="card-item">
          <div class="card">
            <div class="header">
              <div class="top">
                <div class="top-left">
                  <div class="circle">
                    <span class="red circle2"></span>
                  </div>
                  <div class="circle">
                    <span class="yellow circle2"></span>
                  </div>
                  <div class="circle">
                    <span class="green circle2"></span>
                  </div>
                  <div class="title">
                    <p id="title2">{{ card.title }}</p>
                    <span class="position-badge">Уровень: {{ card.position }}</span>
                  </div>
                </div>
                <button
                  class="copy"
                  @click="copyItem(card.content, card.type)"
                  :class="{ copied: copied[card.type] }"
                >
                  <span>
                    <svg v-if="!copied[card.type]" class="clipboard">...</svg>
                    <svg v-if="copied[card.type]" class="checkmark">...</svg>
                  </span>
                </button>
              </div>
            </div>
            <div class="code-container">
              <textarea class="area" readonly>{{ card.content }}</textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>