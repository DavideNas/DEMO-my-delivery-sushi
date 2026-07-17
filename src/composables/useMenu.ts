import { ref, computed } from 'vue'
import { useMenuStore } from '@/stores/menu'
import type { FilterCategory } from '@/components/menu/CategoryFilter.vue'

export function useMenu() {
  const menuStore = useMenuStore()

  // Internal reactive states
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<FilterCategory>('all')

  // We keep the function empty or simulated if in the MenuList you do an onMounted(fetchMenu)
  const fetchMenu = async () => {
    loading.value = true
    error.value = null
    try {
      // The data is already in the store, we only simulate an immediate loading or fake delay
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (err) {
      error.value = 'Impossible to load the menu. Please try again later.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Any additions made by the admin will be instantly reflected here.
  const filteredItems = computed(() => {
    if (selectedCategory.value === 'all') {
      return menuStore.items
    }
    return menuStore.items.filter(item => item.category === selectedCategory.value)
  })

  // Expose only what is needed by the components
  return { 
    items: computed(() => menuStore.items),  // Expose all items from the store
    loading,
    error,
    selectedCategory,
    filteredItems,
    fetchMenu
  }
}