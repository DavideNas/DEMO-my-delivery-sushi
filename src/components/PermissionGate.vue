<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import type { UserPermission, UserRole } from '@/types/auth'

interface Props {
    // Required permissions (single or array)
    permissions?: UserPermission | UserPermission[]
    // If passing an array, requires the user to have ALL of them or just ONE (default: 'all')
    mode?: 'all' | 'any'
    // Allowed roles (single or array)
    roles?: UserRole | UserRole[]
    // Instead of removing the element from the DOM, it disables it (e.g. useful for buttons)
    disabledMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'all',
    disabledMode: false
})

const { hasAnyPermission, hasAllPermissions, hasAnyRole } = usePermissions()

const hasAccess = computed(() => {
    // 1. If any roles are specified, we check those first
    if (props.roles) {
        const roleList = Array.isArray(props.roles) ? props.roles : [props.roles]
        if (!hasAnyRole(roleList)) return false
    }

    // 2. If permissions are specified, we perform checks according to the mode
    if (props.permissions) {
        const permissionList = Array.isArray(props.permissions) ? props.permissions : [props.permissions]

        if (props.mode === 'any') {
            return hasAnyPermission(permissionList)
        }
        return hasAllPermissions(permissionList)
    }

    // If nothing is specified, access is allowed
    return true
})
</script>

<template>
    <!-- Disable mode: readdress the content but disable interaction -->
    <template v-if="disabledMode">
    <div :class="{ 'permissions-disabled': !hasAccess }">
        <slot :has-access="hasAccess" />
    </div>
    </template>

    <!-- Struct mode (default): insert inside DOM only if authorized -->
    <template v-else-if="hasAccess">
    <slot />
    </template>

    <!-- Alternative slot when user doesn't have permissions (fallback/unauthorized) -->
    <template v-else>
    <slot name="unauthorized" />
    </template>
</template>

<style scoped>
.permissions-disabled {
    opacity: 0.6;
    pointer-events: none;
    cursor: not-allowed;
    user-select: none;
}
</style>