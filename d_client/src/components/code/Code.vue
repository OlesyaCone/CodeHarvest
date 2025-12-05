<script setup lang="ts">
import { useUrlStore } from "../../store/url";

const urlStore = useUrlStore();
</script>
<template>
  <div>
    {{ urlStore }}
  </div>
</template>
