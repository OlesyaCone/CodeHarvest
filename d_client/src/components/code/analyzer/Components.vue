<script setup lang="ts">
import { useUrlStore } from "../../../store/url";
import { ref, computed } from "vue";

const urlStore = useUrlStore();
const copied = ref<Record<string, boolean>>({});

const componentCards = computed(() => {
  if (!urlStore.data?.allComponents?.components) return [];

  return urlStore.data.allComponents.components.flatMap((comp, index) => {
    const className = comp.class?.[0]?.name || `component-${index}`;
    const cards = [];

    if (comp.css) {
      cards.push({
        type: `component-css-${index}`,
        title: `${className}.css`,
        content: comp.css,
        position: comp.class?.[0]?.position || 0,
      });
    }

    if (comp.html) {
      cards.push({
        type: `component-html-${index}`,
        title: `${className}.html`,
        content: comp.html,
        position: comp.class?.[0]?.position || 0,
      });
    }

    return cards;
  });
});

const locationCards = computed(() => {
  if (!urlStore.data?.allComponents?.location) return [];

  const loc = urlStore.data.allComponents.location;
  const cards = [];

  if (loc.html) {
    cards.push({
      type: "location-html",
      title: "structure.html",
      content: loc.html,
    });
  }

  if (loc.css) {
    cards.push({
      type: "location-css",
      title: "layout.css",
      content: loc.css,
    });
  }

  if (loc.class && loc.class.length > 0) {
    cards.push({
      type: "location-classes",
      title: "classes.json",
      content: JSON.stringify(loc.class, null, 2),
    });
  }

  return cards;
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
  <div class="components">
    <div v-if="locationCards.length > 0">
      <h1 class="page-title">Расположение</h1>
      <p class="page-description">Структура страницы</p>

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
                    <svg
                      v-if="!copied[card.type]"
                      xml:space="preserve"
                      style="enable-background: new 0 0 512 512"
                      viewBox="0 0 6.35 6.35"
                      y="0"
                      x="0"
                      height="20"
                      width="20"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      class="clipboard"
                    >
                      <g>
                        <path
                          fill="currentColor"
                          d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                        ></path>
                      </g>
                    </svg>
                    <svg
                      v-if="copied[card.type]"
                      xml:space="preserve"
                      style="enable-background: new 0 0 512 512"
                      viewBox="0 0 24 24"
                      y="0"
                      x="0"
                      height="18"
                      width="18"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      class="checkmark"
                    >
                      <g>
                        <path
                          data-original="#000000"
                          fill="currentColor"
                          d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div class="code-container">
              <textarea
                class="area"
                id="code"
                name="code"
                :value="card.content || ''"
                readonly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="componentCards.length > 0">
      <h1 class="page-title">Компоненты</h1>
      <p class="page-description">CSS классы как отдельные компоненты</p>

      <div class="cards-container-code">
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
                    <span class="position-badge" v-if="card.position > 0">
                      Уровень: {{ card.position }}
                    </span>
                  </div>
                </div>

                <button
                  class="copy"
                  @click="copyItem(card.content, card.type)"
                  :class="{ copied: copied[card.type] }"
                >
                  <span>
                    <svg
                      v-if="!copied[card.type]"
                      xml:space="preserve"
                      style="enable-background: new 0 0 512 512"
                      viewBox="0 0 6.35 6.35"
                      y="0"
                      x="0"
                      height="20"
                      width="20"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      class="clipboard"
                    >
                      <g>
                        <path
                          fill="currentColor"
                          d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                        ></path>
                      </g>
                    </svg>
                    <svg
                      v-if="copied[card.type]"
                      xml:space="preserve"
                      style="enable-background: new 0 0 512 512"
                      viewBox="0 0 24 24"
                      y="0"
                      x="0"
                      height="18"
                      width="18"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      class="checkmark"
                    >
                      <g>
                        <path
                          data-original="#000000"
                          fill="currentColor"
                          d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div class="code-container">
              <textarea
                class="area"
                id="code"
                name="code"
                :value="card.content || ''"
                readonly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>