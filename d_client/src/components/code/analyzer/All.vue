<script setup lang="ts">
import { useUrlStore } from "../../../store/url";
import { ref, computed } from "vue";

const urlStore = useUrlStore();
const copiedItems = ref<Record<string, boolean>>({});

const screenshotDataUrl = computed(() => {
  if (!urlStore.data?.screenshot) return null;
  return `data:image/png;base64,${urlStore.data.screenshot}`;
});

const allCards = computed(() => [
  {
    type: "screenshot",
    title: "screenshot.png",
    content: screenshotDataUrl.value,
    icon: "",
    isImage: true,
    gridClass: "left-panel",
  },
  {
    type: "html",
    title: "index.html",
    content: urlStore.data?.html,
    icon: "",
    isImage: false,
    gridClass: "right-panel",
  },
  {
    type: "css",
    title: "style.css",
    content: urlStore.data?.css,
    icon: "",
    isImage: false,
    gridClass: "right-panel",
  },
]);

const copyCode = (type: string, content?: string | null) => {
  if (!content || type === "screenshot") return;

  navigator.clipboard.writeText(content).then(() => {
    copiedItems.value[type] = true;
    setTimeout(() => {
      copiedItems.value[type] = false;
    }, 2000);
  });
};
</script>

<template>
  <div class="code">
    <h1 class="page-title">CodeHarvest</h1>
    <p class="page-description">
      Результат может не совпадать с ожиданием, но будет очень близко. Чтобы код
      работал и стал немного читаемее — просто отформатируйте документ
      (Alt+Shift+F)
    </p>
    <div class="data-grid">
      <div v-for="card in allCards" :key="card.type" :class="card.gridClass">
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
                @click="copyCode(card.type, card.content)"
                :data-text-end="
                  copiedItems[card.type] ? 'Copied!' : 'Copy to clipboard'
                "
                :class="{ copied: copiedItems[card.type] }"
              >
                <span
                  v-if="!card.isImage"
                  :data-text-end="
                    copiedItems[card.type] ? 'Copied!' : 'Copy to clipboard'
                  "
                  data-text-initial="Copy to clipboard"
                  class="tooltip"
                ></span>
                <span>
                  <svg
                    v-if="!copiedItems[card.type]"
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
                    v-if="copiedItems[card.type]"
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
          <div class="code-container" v-if="!card.isImage">
            <textarea class="area" id="code" name="code">{{
              card.content || ""
            }}</textarea>
          </div>
          <div v-else class="screenshot-container">
            <div v-if="card.content" class="image-wrapper">
              <img
                :src="card.content"
                alt="Скриншот сайта"
                class="screenshot-image"
              />
            </div>
            <div v-else class="no-screenshot">
              <p>Скриншот не доступен</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
