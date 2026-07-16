<script setup lang="ts">
// Import ref for reactive state managementof the Drawer
import { ref } from 'vue'

// Keep the imports for the menu and cart components
import MenuList from './components/menu/MenuList.vue'

// Import the composable for cart management
import { useCart } from '@/composables/useCart'

// Import the new Drawer component for the cart
import CartDrawer from './components/cart/CartDrawer.vue'

// Extract only the reactive counter used by Navbar 
const {totalItemsCount} = useCart()

// Local state to manage the open/close state of the cart drawer
const isCartOpen = ref(false)
</script>

<template>
  <v-app>
    <!-- Top bar with primary theme and integrated cart -->
    <v-app-bar color="primary" elevation="1" flat>
      <v-container class="d-flex align-center py-0">
        
        <!-- Logo and Title -->
        <v-app-bar-title class="font-weight-bold d-flex align-center">
          <span class="mr-2">🍣</span> My Delivery Sushi
        </v-app-bar-title>

        <!-- Push the cart to the right -->
        <v-spacer></v-spacer>

        <!-- Button Cart with Reactive Badge, now open Drawer on click -->
        <v-btn icon class="mr-4" data-test="open-cart-btn" @click="isCartOpen = !isCartOpen">
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

    <!-- Drawer Component for the Cart linked via v-model -->
    <CartDrawer v-model="isCartOpen" />

    <!-- Main Content Container -->
    <v-main class="bg-background">
      <v-container>
        <!-- Show our menu list -->
        <MenuList />
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