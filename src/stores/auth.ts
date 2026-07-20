import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import type { AuthState, UserPermission, UserRole } from '@/types/auth';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('auth_token'),
        isLoading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user && !!state.token,

        // If there is no user, we consider the role as 'guest' by default
        currentRole: (state): UserRole => state.user?.role ?? 'guest',

        isAdmin: (state) => state.user?.role === 'admin',
        isUser: (state) => state.user?.role === 'user',
        isGuest: (state) => !state.user,

        /**
         * Checks if the current user has a specific permission.
         */
        hasPermission: (state) => {
            return (permission: UserPermission): boolean => {
                if (!state.user) {
                    // A guest user only has the 'menu:read' permission by default
                    return permission === 'menu:read';
                }
                return state.user.permissions.includes(permission);
            };
        }
    },

    actions: {
        async login(email: string, passwordHash: string) {
            this.isLoading = true;
            this.error = null;
            try {
                const { user, token } = await authService.login(email, passwordHash);
                this.user = user;
                this.token = token;
                localStorage.setItem('auth_token', token);
            } catch (error) {
                this.error = error.message || 'An error occurred during login.';
                this.logout();
                throw err;
            } finally {
                this.isLoading = false;
            }
        },


        async initAuth() {
            if (!this.token) return ;
            this.isLoading = true;
            try {
                const user = await authService.validateToken(this.token);
                this.user = user;
            } catch (error) {
                // if the token is invalid, we clear the user and token from the store and localStorage
                this.error = error.message || 'Invalid token.';
                this.logout();
            } finally {
                this.isLoading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.error = null;
            localStorage.removeItem('auth_token');
        }
    },
});
