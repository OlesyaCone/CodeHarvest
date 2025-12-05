import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Collecting } from '../types/type'

export const useUrlStore = defineStore('url', () => {
  const data = ref<Collecting | null>(null)
  const loading = ref(false)
  
  async function scrape(url: string): Promise<Collecting> {
    loading.value = true
    try {
      const response = await axios.get<Collecting>("/scrape", { 
        params: { url } 
      })
      data.value = response.data
      return response.data
    } finally {
      loading.value = false
    }
  }
  
  return { data, loading, scrape }
})