import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Collecting, CollectingSuccess } from '../types/type'

export const useUrlStore = defineStore('url', () => {
  const data = ref<CollectingSuccess | null>(null) 
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  async function scrape(url: string): Promise<CollectingSuccess> {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get<Collecting>("/scrape", { 
        params: { url } 
      })
      
      const result = response.data
      
      if (!result.success) {
        error.value = result.error
        throw new Error(result.error)
      }
      data.value = result
      
      return result
      
    } catch (err: any) {
      error.value = err.message || 'Ошибка при получении данных'
      throw err
    } finally {
      loading.value = false
    }
  }

  const screenshotUrl = (): string | null => {
    if (!data.value?.screenshot) return null
    return `data:image/png;base64,${data.value.screenshot}`
  }
  
  const downloadScreenshot = (): void => {
    if (!data.value?.screenshot) return
    
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${data.value.screenshot}`
    link.download = `screenshot-${new Date().getTime()}.png`
    link.click()
  }
  
  const clearData = (): void => {
    data.value = null
    error.value = null
  }
  
  return { 
    data, 
    loading, 
    error,
    scrape,
    screenshotUrl,
    downloadScreenshot,
    clearData
  }
})