import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { UserPermission, UserRole } from '@/types/auth';

export function usePermissions() {
    const authStore = useAuthStore();

    // Reactive state for the current user's role
    const user = computed(() => authStore.user)
    const currentRole = computed<UserRole>(() => authStore.currentRole)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    
    // Utility methods 
    const hasPermission = (permission: UserPermission) => authStore.hasPermission(permission)
    const hasAnyPermission = (permissions: UserPermission[]) => permissions.some(p => authStore.hasPermission(p))
    const hasAllPermissions = (permissions: UserPermission[]) => permissions.every(p => authStore.hasPermission(p))
  
    const hasRole = (role: UserRole) => authStore.currentRole === role
    const hasAnyRole = (roles: UserRole[]) => roles.includes(authStore.currentRole)

    return {
        user,
        currentRole,
        isAuthenticated,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        logout: () => authStore.logout()
    }
}