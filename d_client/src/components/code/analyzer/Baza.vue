<script setup lang="ts">
import { useUrlStore } from "../../../store/url";
import { ref, computed } from "vue";

const urlStore = useUrlStore();
const copied = ref<Record<string, boolean>>({});

const fontCards = computed(() => {
  if (!urlStore.data?.allFonts) {
    return [
      { type: "text", title: "text", content: "", isImage: false },
      { type: "html", title: "fonts.html", content: "", isImage: false },
      { type: "css", title: "fonts.css", content: "", isImage: false },
    ];
  }

  return [
    {
      type: "text",
      title: "text",
      content: "",
      isImage: false,
    },
    {
      type: "html",
      title: "fonts.html",
      content: urlStore.data.allFonts.html || "",
      isImage: false,
    },
    {
      type: "css",
      title: "fonts.css",
      content: urlStore.data.allFonts.css || "",
      isImage: false,
    },
  ];
});

const fontExampleStyle = computed(() => {
  const fontHtml = urlStore.data?.allFonts?.html || "";

  if (fontHtml.includes("style=")) {
    const styleMatch = fontHtml.match(/style=["']([^"']+)["']/);
    if (styleMatch) {
      return styleMatch[1];
    }
  }

  return "";
});

const colorsList = computed(() => urlStore.data?.allColors || []);

const copyItem = (text: string, key: string) => {
  if (!text || text.trim() === "") return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      copied.value[key] = true;
      setTimeout(() => {
        copied.value[key] = false;
      }, 2000);
    })
    .catch((err) => {
      console.error("Ошибка копирования:", err);
    });
};
</script>

<template>
  <div class="baza">
    <h1 class="page-title">Шрифты и цвета</h1>
    <p class="page-description">Шрифт</p>

    <div class="cards-container">
      <div v-for="card in fontCards" :key="card.type" class="card-item">
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
                @click="
                  card.type === 'text'
                    ? copyItem('Пример использования шрифтов', 'text')
                    : copyItem(card.content, card.type)
                "
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
          <div v-if="card.type === 'text'" class="font-example-container">
            <div
              class="font-example"
              v-html="
                urlStore.data?.allFonts?.html || 'Пример использования шрифтов'
              "
              :style="fontExampleStyle"
            ></div>
          </div>

          <div v-else class="code-container">
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

    <div class="colors-section">
      <h2 class="page-description">Цвета ({{ colorsList.length }})</h2>
      <div class="colors-scroll-container">
        <div
          v-for="(color, index) in colorsList"
          :key="index"
          class="color-item"
        >
          <button
            class="color-copy-btn copy"
            @click="copyItem(color, 'color-' + index)"
            :class="{ copied: copied['color-' + index] }"
          >
            <span>
              <svg
                v-if="!copied['color-' + index]"
                xml:space="preserve"
                style="enable-background: new 0 0 512 512"
                viewBox="0 0 6.35 6.35"
                y="0"
                x="0"
                height="16"
                width="16"
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
                v-if="copied['color-' + index]"
                xml:space="preserve"
                style="enable-background: new 0 0 512 512"
                viewBox="0 0 24 24"
                y="0"
                x="0"
                height="14"
                width="14"
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
          
          <div 
            class="color-preview" 
            :style="{ backgroundColor: color }"
          ></div>
          
          <span class="color-hex">{{ color }}</span>
        </div>
      </div>
    </div>
  </div>
</template>