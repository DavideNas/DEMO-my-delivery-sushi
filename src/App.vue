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
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
</style>