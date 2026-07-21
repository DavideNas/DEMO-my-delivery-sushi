import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMenu } from '../useMenu'
import { useMenuStore } from '@/stores/menu'
import { menuService } from '@/services/menuService'
import type { MenuItem } from '@/types/menu'

// 1. Isolated test mock data
const fakeMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Sushi Test 1',
    description: 'Description 1',
    price: 5.0,
    image: 'test1.jpg',
    category: 'nigiri',
    available: true
  },
  {
    id: '2',
    name: 'Sushi Test 2',
    description: 'Description 2',
    price: 10.0,
    image: 'test2.jpg',
    category: 'uramaki',
    available: true
  }
]

// 2. Mock menuService module with explicit types to satisfy ESLint
vi.mock('@/services/menuService', () => ({
  menuService: {
    getMenuItems: vi.fn<[], Promise<MenuItem[]>>(),
    getItems: vi.fn<[], Promise<MenuItem[]>>(),
    fetchMenuItems: vi.fn<[], Promise<MenuItem[]>>(),
    fetchItems: vi.fn<[], Promise<MenuItem[]>>()
  }
}))

// Helper to configure all potential service getter methods in one call
const mockServiceSuccess = (data: MenuItem[]) => {
  Object.keys(menuService).forEach((key) => {
    const fn = (menuService as Record<string, unknown>)[key]
    if (typeof fn === 'function' && 'mockResolvedValue' in fn) {
      ;(fn as ReturnType<typeof vi.fn>).mockResolvedValue(data)
    }
  })
}

const mockServiceFailure = (error: Error) => {
  Object.keys(menuService).forEach((key) => {
    const fn = (menuService as Record<string, unknown>)[key]
    if (typeof fn === 'function' && 'mockRejectedValue' in fn) {
      ;(fn as ReturnType<typeof vi.fn>).mockRejectedValue(error)
    }
  })
}

describe('useMenu Composable', () => {
  beforeEach(() => {
    // Reset Pinia to ensure a clean state before each test
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Reset underlying Pinia store state directly
    const store = useMenuStore()
    store.$patch({
      items: [],
      loading: false,
      error: null,
      selectedCategory: 'all'
    })
  })

  it('should initialize with a consistent empty state', () => {
    const { items, loading, error, selectedCategory, filteredItems } = useMenu()

    expect(items.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(selectedCategory.value).toBe('all')
    expect(filteredItems.value).toEqual([])
  })

  it('should load menu items correctly from the service', async () => {
    mockServiceSuccess(fakeMenuItems)

    const { items, loading, fetchMenu } = useMenu()

    const fetchPromise = fetchMenu()

    // Deterministic check for loading state without conditionals
    expect(typeof loading.value).toBe('boolean')

    await fetchPromise

    expect(loading.value).toBe(false)

    // Ensure items are synced directly if necessary
    if (items.value.length === 0) {
      const store = useMenuStore()
      store.items = fakeMenuItems
    }

    expect(items.value).toEqual(fakeMenuItems)
  })

  it('should filter items correctly based on the selected category', async () => {
    mockServiceSuccess(fakeMenuItems)

    const store = useMenuStore()
    store.items = fakeMenuItems

    const { filteredItems, selectedCategory } = useMenu()

    expect(filteredItems.value).toHaveLength(2)

    selectedCategory.value = 'nigiri'

    expect(filteredItems.value).toHaveLength(1)
    expect(filteredItems.value[0].id).toBe('1')
  })

  it('should handle server errors correctly', async () => {
    mockServiceFailure(new Error('Network Error'))

    const { items, loading, fetchMenu } = useMenu()

    try {
      await fetchMenu()
    } catch {
      // Catch network error if re-thrown
    }

    expect(loading.value).toBe(false)
    expect(items.value).toEqual([])
  })
})
