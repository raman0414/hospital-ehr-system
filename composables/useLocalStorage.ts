export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const data = ref<T>(defaultValue) as Ref<T>
  const isLoaded = ref(false)

  const load = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(key)
        if (stored) {
          data.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error)
      }
      isLoaded.value = true
    }
  }

  const save = () => {
    if (process.client) {
      try {
        localStorage.setItem(key, JSON.stringify(data.value))
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error)
      }
    }
  }

  const clear = () => {
    if (process.client) {
      localStorage.removeItem(key)
      data.value = defaultValue
    }
  }

  onMounted(() => {
    load()
  })

  watch(data, () => {
    if (isLoaded.value) {
      save()
    }
  }, { deep: true })

  return {
    data,
    isLoaded,
    load,
    save,
    clear
  }
}
