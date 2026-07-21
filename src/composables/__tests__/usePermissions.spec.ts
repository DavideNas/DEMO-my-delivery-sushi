import { describe, beforeEach, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePermissions } from '../usePermissions'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/auth'

describe('usePermissions', () => {
  let authStore: ReturnType<typeof useAuthStore>

  // Init a clean instance of Pinia before EVERY test
  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    localStorage.clear()
  })

  /**
   * 1. GUEST SCENARIO (Unauthenticated user)
   */
  describe('Guest user (unauthenticated)', () => {
    it('should identify role as guest and isAuthenticated as false', () => {
      const { currentRole, isAuthenticated } = usePermissions()

      expect(isAuthenticated.value).toBe(false)
      expect(currentRole.value).toBe('guest')
    })

    it('should allow default "menu:read" permission for guests', () => {
      const { hasPermission } = usePermissions()

      expect(hasPermission('menu:read')).toBe(true)
      expect(hasPermission('cart:write')).toBe(false)
    })

    it('should correctly evaluate roles with hasRole and hasAnyRole', () => {
      const { hasRole, hasAnyRole } = usePermissions()

      expect(hasRole('guest')).toBe(true)
      expect(hasRole('admin')).toBe(false)
      expect(hasAnyRole(['admin', 'guest'])).toBe(true)
      expect(hasAnyRole(['admin', 'user'])).toBe(false)
    })
  })

  /**
   * 2. USER / ADMIN SCENARIO (Authenticated User)
   */
  describe('Authenticated user permissions', () => {
    const mockUser: User = {
      id: 'usr-1',
      name: 'Mario Rossi',
      email: 'mario@example.com',
      role: 'user',
      permissions: ['menu:read', 'cart:write', 'orders:read']
    }

    beforeEach(() => {
      authStore.user = mockUser
      authStore.token = 'fake-jwt-token'
    })

    it('should return correct authenticated state and user role', () => {
      const { isAuthenticated, currentRole, user } = usePermissions()

      expect(isAuthenticated.value).toBe(true)
      expect(currentRole.value).toBe('user')
      expect(user.value).toEqual(mockUser)
    })

    it('should verify specific permissions correctly', () => {
      const { hasPermission } = usePermissions()

      expect(hasPermission('cart:write')).toBe(true)
      expect(hasPermission('admin:access')).toBe(false)
    })

    it('should evaluate hasAnyPermission correctly (OR logic)', () => {
      const { hasAnyPermission } = usePermissions()

      // User has 'cart:write', so at least one is present -> true
      expect(hasAnyPermission(['admin:access', 'cart:write'])).toBe(true)
      // User has none of these -> false
      expect(hasAnyPermission(['admin:access', 'users:delete'])).toBe(false)
    })

    it('should evaluate hasAllPermissions correctly (AND logic)', () => {
      const { hasAllPermissions } = usePermissions()

      // User has both 'menu:read' and 'cart:write' -> true
      expect(hasAllPermissions(['menu:read', 'cart:write'])).toBe(true)
      // User does not have 'admin:access' -> false
      expect(hasAllPermissions(['menu:read', 'admin:access'])).toBe(false)
    })
  })

  /**
   * 3. ACTIONS (Logout)
   */
  describe('Actions', () => {
    it('should clear user state upon logout call', () => {
      authStore.user = {
        id: 'adm-1',
        name: 'Admin Boss',
        email: 'admin@sushi.com',
        role: 'admin',
        permissions: ['admin:access']
      } as User
      authStore.token = 'active-token'

      const { logout, isAuthenticated, currentRole } = usePermissions()

      expect(isAuthenticated.value).toBe(true)

      logout()

      expect(isAuthenticated.value).toBe(false)
      expect(currentRole.value).toBe('guest')
      expect(authStore.user).toBeNull()
    })
  })
})
