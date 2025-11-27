import { createRouter, createWebHistory } from "vue-router";
import Start from "./components/Start.vue";
import Content from "./views/Content.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Start",
      component: Start,
    },
    {
      path: "/content",
      name: "Content",
      component: Content,
    },
  ],
});

export default router;