<script setup lang="ts">
import { useUrlStore } from "../store/url";
import Loading from './code/Loading.vue';
import Code from './code/Code.vue';

const urlStore = useUrlStore();
</script>

<template>
  <Loading v-if="urlStore.loading"></Loading>
  <Code v-else></Code>
</template>