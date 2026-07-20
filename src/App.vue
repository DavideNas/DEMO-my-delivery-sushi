<script setup lang="ts">
import { ref } from 'vue'
import MainAppBar from './components/layout/MainAppBar.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import AppNotification from '@/components/common/AppNotification.vue'

// Stato locale per gestire l'apertura del carrello drawer
const isCartOpen = ref(false)
</script>

<template>
  <v-app>
    <!-- Global toast is always listening here -->
    <AppNotification />


    <!-- La nuova Navbar estratta -->
    <MainAppBar @toggle-cart="isCartOpen = !isCartOpen" />

    <!-- Il Drawer del Carrello -->
    <CartDrawer v-model="isCartOpen" />

    <!-- Contenuto Principale -->
    <v-main class="bg-background">
      <!-- Reactive handling of asynchronous route loading -->
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <Suspense>
            <!-- Target component loaded -->
            <component :is="Component" />

              <!-- Fallback shown WHILE the route bundle is downloading -->
              <template #fallback>

                <v-container class="fill-height justify-center align-center">
                  <div class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      size="64"
                      width="6"
                      class="mb-4"
                    ></v-progress-circular>
                    <p class="text-body-1 text-grey-darken-1">Loading form...</p>
                  </div>
                </v-container>

              </template>
          </Suspense>
        </template>
      </router-view>
    </v-main>
  </v-app>
</template>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
</style>
