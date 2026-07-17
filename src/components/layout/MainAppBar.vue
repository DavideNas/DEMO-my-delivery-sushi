<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { useAuthStore } from '@/stores/auth'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'

// Emit per segnalare ad App.vue di aprire il carrello
defineEmits<{
  (e: 'toggle-cart'): void
}>()

const { totalItemsCount } = useCart()
const authStore = useAuthStore()

// Stato per il modale di login aperto dall'icona profilo
const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <v-app-bar color="primary" elevation="1" flat>
    <v-container class="d-flex align-center py-0">
      
      <!-- Logo e Titolo -->
      <v-app-bar-title class="font-weight-bold d-flex align-center">
        <router-link to="/" class="text-decoration-none color-white-link">
          <div class="d-flex align-center cursor-pointer">
            <v-icon icon="mdi-sushi" class="mr-2" color="primary"></v-icon>
            <span class="mr-2">🍣</span>
            <span class="font-weight-bold text-white">My Delivery Sushi</span>
          </div>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- ── SEZIONE UTENTE REATTIVA ── -->
      <div class="d-flex align-center mr-2">

        <v-btn
          v-if="isAuthenticated && authStore.currentRole === 'admin'"
          to="/admin"
          prepend-icon="mdi-shield-crown-outline"
          variant="text"
          color="white"
          class="text-none mr-2"
        >
          Menu Admin
        </v-btn>
        
        <!-- Caso 1: Loggato -> Menu Dropdown -->
        <v-menu v-if="isAuthenticated" location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" rounded="xl" class="text-none text-white">
              <v-avatar size="28" color="amber-darken-2" class="mr-2 text-white">
                {{ currentUser?.name?.charAt(0).toUpperCase() || 'U' }}
              </v-avatar>
              <span class="text-body-2 font-weight-medium d-none d-sm-inline">
                {{ currentUser?.name }}
              </span>
              <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list density="comfortable" width="180" class="pa-1 rounded-lg">
            <v-list-item class="text-caption text-grey-darken-1">
              Ruolo: <v-chip size="x-small" color="secondary" compact>{{ authStore.currentRole }}</v-chip>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Esci"
              color="error"
              rounded="md"
              @click="handleLogout"
            ></v-list-item>
          </v-list>
        </v-menu>

        <!-- Caso 2: Ospite -> Icona di Login diretta -->
        <v-btn
          v-else
          icon="mdi-account-circle-outline"
          variant="text"
          color="white"
          @click="isLoginOpen = true"
        ></v-btn>
      </div>

      <!-- ── BOTTONE CARRELLO ── -->
      <v-btn icon data-test="open-cart-btn" @click="$emit('toggle-cart')">
        <v-badge
          :content="totalItemsCount"
          :model-value="totalItemsCount > 0"
          color="amber-darken-2"
          text-color="white"
        >
          <v-icon color="white" size="28">mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>

    </v-container>
  </v-app-bar>

  <!-- LOGIN MODAL -->
  <LoginModal 
    v-model="isLoginOpen" 
    @success="handleCheckoutSuccess"
    @switch-to-register="isRegisterOpen = true" />

  <!-- REGISTER MODAL -->
  <RegisterModal 
    v-model="isRegisterOpen"
    @success="handleCheckoutSuccess"
    @switch-to-login="isLoginOpen = true" />

</template>